// src/lib/products/loadProducts.ts

export type ProductSource = 'warehouse';
export type ProductCollection = 'local';

export interface NormalizedProduct {
  id: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  source: ProductSource;
  collection: ProductCollection;
}

type ImageIndexStatus = 'unknown' | 'loaded' | 'missing' | 'error';

const PLACEHOLDER_IMAGE = '/assets/products/placeholder.png';

// مكان ملف JSONL على المتصفح (public/...)
const WAREHOUSE_JSONL_URL = '/assets/images/warehouse_products.jsonl';

// انت كنت بتحمّل الصور هنا: public/assets/images/products
const LOCAL_IMAGES_PREFIX = '/assets/images/products';

// لو الداتا بتاعتك فيها local_image بصيغة /images/products/... هنحوّلها للمسار الصحيح
const normalizeLocalImagePath = (value: string) => {
  if (!value) return '';
  // مثال: /images/products/353.jpg  ->  /assets/images/products/353.jpg
  if (value.startsWith('/images/products/')) {
    return value.replace('/images/products/', `${LOCAL_IMAGES_PREFIX}/`);
  }
  // لو موجودة أصلاً صح
  if (value.startsWith('/assets/images/products/')) return value;

  // لو قيمة نسبية
  if (value.startsWith('images/products/')) return `/${value}`;

  return value;
};

let imageIndexStatus: ImageIndexStatus = 'unknown';
export const getImageIndexStatus = () => imageIndexStatus;

const parseJsonl = (text: string) => {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const items: any[] = [];
  for (const line of lines) {
    try {
      items.push(JSON.parse(line));
    } catch {
      // لو فيه سطر بايظ، نتجاهله
    }
  }
  return items;
};

const toNormalized = (row: any): NormalizedProduct | null => {
  const id = String(row.product_id ?? '').trim();
  if (!id) return null;

  const title = String(row.name ?? '').trim() || `Product ${id}`;
  const brand = String(row.brand_name ?? '').trim() || 'Unknown';
  const category = String(row.category_name ?? '').trim() || '';

  const local = normalizeLocalImagePath(String(row.local_image ?? '').trim());
  const remote = String(row.image_url ?? '').trim();

  const image = local || remote || PLACEHOLDER_IMAGE;

  return {
    id,
    title,
    brand,
    category,
    image,
    source: 'warehouse',
    collection: 'local',
  };
};

export interface LoadProductsOptions {
  collections?: ProductCollection[];
  sources?: ProductSource[];
}

export const loadProducts = async (
  _opts: LoadProductsOptions = {},
): Promise<NormalizedProduct[]> => {
  try {
    imageIndexStatus = 'loaded'; // عندنا صور محلية مباشرة، مفيش index

    const res = await fetch(WAREHOUSE_JSONL_URL, { cache: 'no-store' });
    if (!res.ok) {
      imageIndexStatus = res.status === 404 ? 'missing' : 'error';
      throw new Error(`Unable to load JSONL from ${WAREHOUSE_JSONL_URL} (${res.status})`);
    }

    const text = await res.text();
    const rows = parseJsonl(text);

    const products = rows.map(toNormalized).filter(Boolean) as NormalizedProduct[];
    return products;
  } catch (e) {
    imageIndexStatus = 'error';
    throw e;
  }
};

export const listCategories = (products: NormalizedProduct[]) =>
  Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
