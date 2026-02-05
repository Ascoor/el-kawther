// src/data/warehouseAdapter.ts

// ملاحظة: الملف موجود في public/assets/images/warehouse_products.jsonl
const JSONL_URL = '/assets/images/warehouse_products.json';

// ===== Types (خفيفة) =====
type RawRow = {
  product_id: string | number;
  name?: string;
  description?: string;
  category_name?: string;
  brand_name?: string | null;
  price?: number | string | null;
  sale_price?: number | string | null;
  regular_price?: number | string | null;
  currency?: string | null;
  is_available?: boolean | string | null;
  is_out_of_stock?: boolean | string | null;
  image?: string | null;
  local_image?: string | null;
  image_url?: string | null;
  product_url?: string | null;
  custom_url?: string | null;
};

const safeStr = (v: any, fb = '') => (v === null || v === undefined ? fb : String(v)).trim();
const safeNum = (v: any, fb = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fb;
};
const safeBool = (v: any, fb = false) => {
  if (typeof v === 'boolean') return v;
  const s = String(v).toLowerCase().trim();
  if (['true', '1', 'yes', 'y'].includes(s)) return true;
  if (['false', '0', 'no', 'n'].includes(s)) return false;
  return fb;
};
const slugify = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\w-]+/g, '') // يسمح بالعربي + الحروف/الأرقام
    .replace(/-+/g, '-');

// ===== Exports اللي StoreContext بيستوردهم =====
// هنملاهم بعد التحميل
export const categories: any[] = [];
export const companies: any[] = [];
export const products: any[] = [];

let loaded = false;
let loadPromise: Promise<void> | null = null;

async function fetchJsonl(): Promise<RawRow[]> {
  const res = await fetch(JSONL_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${JSONL_URL}: ${res.status}`);

  const text = await res.text();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // كل سطر JSON
  return lines.map((line, idx) => {
    try {
      return JSON.parse(line) as RawRow;
    } catch {
      // لو فيه سطر بايظ ما يوقعش التطبيق كله
      console.warn(`Bad JSONL line #${idx + 1}`);
      return {} as RawRow;
    }
  });
}

/**
 * لازم تناديها مرة واحدة قبل ما تستخدم categories/companies/products
 * (StoreProvider هيناديها)
 */
export async function ensureWarehouseLoaded() {
  if (loaded) return;
  if (!loadPromise) {
    loadPromise = (async () => {
      const rows = await fetchJsonl();

      // ===== build categories =====
      const catMap = new Map<string, any>();
      // ===== build companies(brand) =====
      const brandMap = new Map<string, any>();

      for (const r of rows) {
        const catName = safeStr(r.category_name, 'بدون تصنيف');
        const catId = `cat-${slugify(catName) || 'uncat'}`;
        if (!catMap.has(catId)) {
          catMap.set(catId, {
            id: catId,
            name_ar: catName,
            name_en: catName, // لو لاحقًا هتترجم
            slug: slugify(catName) || 'uncat',
          });
        }

        const brandName = safeStr(r.brand_name, 'Unknown');
        const brandId = `brand-${slugify(brandName) || 'unknown'}`;
        if (!brandMap.has(brandId)) {
          brandMap.set(brandId, {
            id: brandId,
            name_ar: brandName,
            name_en: brandName,
            logo: '/assets/logo-light.png', // placeholder
          });
        }
      }

      const builtCategories = Array.from(catMap.values());
      const builtCompanies = Array.from(brandMap.values());

      // ===== build products =====
      const builtProducts = rows
        .filter((r) => safeStr(r.product_id))
        .map((r) => {
          const id = safeStr(r.product_id);
          const title = safeStr(r.name, `Product ${id}`);
          const desc = safeStr(r.description, '');

          const catName = safeStr(r.category_name, 'بدون تصنيف');
          const categoryId = `cat-${slugify(catName) || 'uncat'}`;

          const brandName = safeStr(r.brand_name, 'Unknown');
          const companyId = `brand-${slugify(brandName) || 'unknown'}`;

          // أهم جزء: الصورة (اختيار 1: local_image => /images/products/xxx.jpg)
          const image =
            safeStr(r.local_image) ||
            safeStr(r.image) ||
            safeStr(r.image_url) ||
            '/assets/products/placeholder.png';

          const price = safeNum(r.sale_price ?? r.price ?? r.regular_price, 0);
          const regularPrice = safeNum(r.regular_price ?? price, price);

          const isAvailable = safeBool(r.is_available, true) && !safeBool(r.is_out_of_stock, false);

          // IMPORTANT: هنا بنبني شكل Product "عام"
          // لو عندك Product type مختلف، عدّل الحقول دي بما يناسب مشروعك
          return {
            id,
            name_ar: title,
            name_en: title,
            description_ar: desc,
            description_en: desc,
            price,
            regularPrice,
            salePrice: price,
            currency: safeStr(r.currency, 'SAR'),
            categoryId,
            companyId,
            image,
            images: [image],
            slug: safeStr(r.custom_url) || slugify(title) || id,
            sourceUrl: safeStr(r.product_url),
            stockQty: isAvailable ? 999 : 0,
            isFrozen: false,
            // StoreContext بتاعك بيستخدم weightOptions
            weightOptions: [{ label_ar: 'Default', label_en: 'Default', priceDelta: 0 }],
          };
        });

      // املى exports
      categories.splice(0, categories.length, ...builtCategories);
      companies.splice(0, companies.length, ...builtCompanies);
      products.splice(0, products.length, ...builtProducts);

      loaded = true;
    })();
  }
  return loadPromise;
}
