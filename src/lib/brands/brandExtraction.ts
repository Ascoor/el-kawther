import type { Product as WarehouseProduct } from '@/lib/warehouse/loadWarehouseProducts';

export type Company = {
  id: string;
  name: string;
  productsCount: number;
  topCategories: Array<{ name: string; count: number }>;
  sampleProducts: Array<{ product_id: string; name: string; image_url?: string; price?: number }>;
  logoHint?: string;
};

const ARABIC_DIACRITICS = /[\u064B-\u065F\u0670]/g;
const EDGE_SYMBOLS = /^[\s\-_\\|/()[\]{}]+|[\s\-_\\|/()[\]{}]+$/g;

const GENERIC_WORDS = new Set([
  'عصير',
  'مياه',
  'ماء',
  'شراب',
  'مشروب',
  'نكتار',
  'لبن',
  'حليب',
  'تمر',
  'بسكويت',
  'شيبس',
  'زيت',
  'سكر',
  'ملح',
  'juice',
  'water',
  'drink',
  'beverage',
  'nectar',
  'milk',
]);

const UNIT_HINTS = new Set([
  'مل',
  'لتر',
  'ل',
  'جم',
  'جرام',
  'كجم',
  'كيلو',
  'ك',
  'ml',
  'l',
  'g',
  'kg',
  'pack',
  'pcs',
  'pc',
  'box',
  'bottle',
  'can',
  'عبوة',
  'حبة',
  'عدد',
  'كرتون',
]);

const SYNONYMS = new Map<string, string>([
  ['ميريندا', 'ميرندا'],
  ['ميرندا', 'ميرندا'],
  ['سفن', 'سفن اب'],
  ['سفن اب', 'سفن اب'],
]);

const safeStr = (value: unknown, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
};

const safeNum = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const safeBool = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value ?? '').toLowerCase().trim();
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  return fallback;
};

const normalizeSpaces = (value: string) => value.replace(/\s+/g, ' ').trim();

const normalizeHamza = (value: string) => value.replace(/[إأآ]/g, 'ا');

const stripEdgeSymbols = (value: string) => value.replace(EDGE_SYMBOLS, '');

const removeDiacritics = (value: string) => value.replace(ARABIC_DIACRITICS, '');

const slugify = (text: string) =>
  normalizeSpaces(text)
    .toLowerCase()
    .replace(/[^\u0600-\u06FF\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

const applySynonyms = (value: string) => SYNONYMS.get(value) ?? value;

export const brandToId = (brand: string) => slugify(normalizeBrandName(brand));

export const normalizeBrandName = (name: string): string => {
  if (!name) return '';
  const cleaned = normalizeSpaces(removeDiacritics(normalizeHamza(stripEdgeSymbols(name))));
  return applySynonyms(cleaned);
};

const splitNameTokens = (name: string) =>
  normalizeSpaces(name)
    .replace(/[،,]/g, ' ')
    .split(' ')
    .map((token) => token.trim())
    .filter(Boolean);

const hasNumbers = (value: string) => /\d/.test(value);

const hasUnitHint = (token: string) => UNIT_HINTS.has(token.toLowerCase());

const buildCandidateFromName = (name: string) => {
  const normalized = normalizeBrandName(name);
  const tokens = splitNameTokens(normalized);
  const candidateTokens: string[] = [];

  for (const token of tokens) {
    if (hasNumbers(token)) break;
    if (token.includes('x') || token.includes('×') || token.includes('*')) break;
    if (hasUnitHint(token)) break;
    candidateTokens.push(token);
    if (candidateTokens.length >= 3) break;
  }

  return candidateTokens.join(' ');
};

const candidateHasGenericWord = (candidate: string) =>
  splitNameTokens(candidate).some((token) => GENERIC_WORDS.has(token.toLowerCase()));

const candidateHasUnitsOrNumbers = (candidate: string) => {
  const tokens = splitNameTokens(candidate);
  return tokens.some((token) => hasNumbers(token) || hasUnitHint(token));
};

export const extractBrandFromProduct = (
  product: WarehouseProduct,
): { brand?: string; score: number; source: 'brand_name' | 'name' | 'none' } => {
  const brandName = normalizeBrandName(safeStr(product.brand_name));
  if (brandName) {
    return { brand: brandName, score: 3, source: 'brand_name' };
  }

  const name = safeStr(product.name);
  if (!name) return { score: 0, source: 'none' };

  const candidate = buildCandidateFromName(name);
  if (!candidate) return { score: 0, source: 'none' };

  let score = 0;
  const tokenCount = splitNameTokens(candidate).length;
  const hasUnitsOrNumbers = candidateHasUnitsOrNumbers(candidate);

  if (tokenCount <= 2 && !hasUnitsOrNumbers) {
    score += 2;
  }

  if (hasUnitsOrNumbers) {
    score -= 2;
  }

  if (tokenCount > 3) {
    score -= 2;
  }

  if (candidateHasGenericWord(candidate)) {
    score -= 1;
  }

  return { brand: candidate, score, source: 'name' };
};

let hasLoggedReport = false;

export const buildCompaniesIndex = (
  products: WarehouseProduct[],
  opts?: { minProductsThreshold?: number; maxCompanies?: number; maxSamples?: number },
): Company[] => {
  const minProductsThreshold = opts?.minProductsThreshold ?? 2;
  const maxSamples = opts?.maxSamples ?? 6;
  const maxCompanies = opts?.maxCompanies;

  const map = new Map<string, Company & { categoryCounts: Map<string, number>; sources: Set<string> }>();
  const inferredBrandScores: Array<{ brand: string; score: number }> = [];

  let brandFromNameCount = 0;
  let brandFromBrandNameCount = 0;

  for (const product of products) {
    const extraction = extractBrandFromProduct(product);
    if (!extraction.brand) {
      continue;
    }

    const shouldUseInferred = extraction.source === 'name' && extraction.score >= 2;
    if (extraction.source === 'name') {
      inferredBrandScores.push({ brand: extraction.brand, score: extraction.score });
    }

    if (extraction.source === 'brand_name') {
      brandFromBrandNameCount += 1;
    } else if (shouldUseInferred) {
      brandFromNameCount += 1;
    }

    const normalizedName = normalizeBrandName(extraction.brand);
    if (extraction.source === 'name' && !shouldUseInferred) {
      continue;
    }
    const id = brandToId(normalizedName);
    if (!id) continue;

    if (!map.has(id)) {
      map.set(id, {
        id,
        name: normalizedName,
        productsCount: 0,
        topCategories: [],
        sampleProducts: [],
        logoHint: normalizedName,
        categoryCounts: new Map(),
        sources: new Set(),
      });
    }

    const entry = map.get(id)!;
    entry.productsCount += 1;
    entry.sources.add(extraction.source);

    const categoryName = safeStr(product.category_name, 'بدون تصنيف');
    entry.categoryCounts.set(categoryName, (entry.categoryCounts.get(categoryName) ?? 0) + 1);

    if (entry.sampleProducts.length < maxSamples && safeBool(product.is_available, true)) {
      entry.sampleProducts.push({
        product_id: safeStr(product.product_id),
        name: safeStr(product.name),
        image_url: safeStr(product.image_url || product.image || product.original_image) || undefined,
        price: safeNum(product.price ?? product.sale_price ?? product.regular_price, 0) || undefined,
      });
    }
  }

  const companies = Array.from(map.values()).map((entry) => {
    const topCategories = Array.from(entry.categoryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));

    return {
      id: entry.id,
      name: entry.name,
      productsCount: entry.productsCount,
      topCategories,
      sampleProducts: entry.sampleProducts,
      logoHint: entry.logoHint,
    } satisfies Company;
  });

  const filtered = companies.filter((company) => {
    const source = map.get(company.id)?.sources ?? new Set();
    const hasBrandName = source.has('brand_name');
    if (hasBrandName) return true;
    return company.productsCount >= minProductsThreshold;
  });

  filtered.sort((a, b) => {
    if (b.productsCount !== a.productsCount) return b.productsCount - a.productsCount;
    return a.name.localeCompare(b.name, 'ar');
  });

  const trimmed = maxCompanies ? filtered.slice(0, maxCompanies) : filtered;

  if (!hasLoggedReport) {
    hasLoggedReport = true;
    const top20 = trimmed.slice(0, 20).map((c) => ({ name: c.name, count: c.productsCount }));
    const suspicious = inferredBrandScores.filter(({ brand, score }) => {
      const tokenCount = splitNameTokens(brand).length;
      return score < 2 || candidateHasUnitsOrNumbers(brand) || tokenCount > 3;
    });

    console.group('Warehouse brand extraction report');
    console.log('Total products:', products.length);
    console.log('Brands from brand_name:', brandFromBrandNameCount);
    console.log('Brands inferred from name:', brandFromNameCount);
    console.table(top20);
    console.table(suspicious.slice(0, 20));
    console.groupEnd();
  }

  return trimmed;
};
