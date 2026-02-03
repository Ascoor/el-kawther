import { Category, Product } from '@/types';
import { NormalizedProduct } from '@/lib/products/loadProducts';

export function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

export function assertNonEmpty(value: string, label: string) {
  if (!value || !value.trim()) {
    throw new Error(`${label} is required`);
  }
}

export function makeSlug(input: string) {
  return normalizeKey(input)
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[^a-z0-9\u0600-\u06FF]+/gi, '-')
    .replace(/^-+|-+$/g, '');
}

export function ensureUniqueSlug(base: string, used: Set<string>) {
  let slug = base;
  let i = 2;
  while (used.has(slug)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  used.add(slug);
  return slug;
}

type ProductKeyInput = {
  sku?: string;
  source?: string;
  externalId?: string;
  slug?: string;
  id: string;
};

type CategoryKeyInput = {
  slug?: string;
  name_en?: string;
  name_ar?: string;
  id: string;
};

function getProductKey(product: ProductKeyInput) {
  if (product.sku) {
    return `sku:${normalizeKey(product.sku)}`;
  }
  if (product.source && product.externalId) {
    return `ext:${product.source}:${normalizeKey(product.externalId)}`;
  }
  if (product.slug) {
    return `slug:${normalizeKey(product.slug)}`;
  }
  return `id:${product.id}`;
}

function getCategoryKey(category: CategoryKeyInput) {
  if (category.slug) {
    return `slug:${normalizeKey(category.slug)}`;
  }
  const name = category.name_en || category.name_ar || category.id;
  return `name:${normalizeKey(name)}`;
}

export function mergeUniqueProducts(existing: Product[], incoming: Product[]) {
  const map = new Map<string, Product>();
  for (const product of existing) {
    map.set(getProductKey(product), product);
  }

  for (const product of incoming) {
    assertNonEmpty(product.name_en || product.name_ar || '', 'Product name');
    const key = getProductKey(product);
    map.set(key, { ...(map.get(key) ?? ({} as Product)), ...product });
  }

  return Array.from(map.values());
}

export function mergeUniqueCategories(existing: Category[], incoming: Category[]) {
  const map = new Map<string, Category>();
  const usedSlugs = new Set<string>(existing.map((category) => normalizeKey(category.slug)));

  for (const category of existing) {
    map.set(getCategoryKey(category), category);
  }

  for (const category of incoming) {
    const name = category.name_en || category.name_ar || '';
    assertNonEmpty(name, 'Category name');

    const baseSlug = category.slug ? makeSlug(category.slug) : makeSlug(name);
    const uniqueSlug = ensureUniqueSlug(baseSlug, usedSlugs);

    const key = getCategoryKey(category);
    map.set(key, { ...(map.get(key) ?? ({} as Category)), ...category, slug: uniqueSlug });
  }

  return Array.from(map.values());
}

export function buildCategoriesFromNormalized(products: NormalizedProduct[]) {
  const byKey = new Map<string, { name_en: string; name_ar?: string; slug: string }>();
  const usedSlugs = new Set<string>();

  for (const product of products) {
    const name_en = (product.category || 'Uncategorized').trim();
    const key = normalizeKey(name_en);

    if (!byKey.has(key)) {
      const baseSlug = makeSlug(name_en);
      const slug = ensureUniqueSlug(baseSlug || 'category', usedSlugs);
      byKey.set(key, { name_en, slug });
    }
  }

  return Array.from(byKey.values());
}
