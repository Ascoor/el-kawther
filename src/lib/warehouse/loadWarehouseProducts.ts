export type Product = {
  product_id?: string | number;
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
  is_on_sale?: boolean | string | null;
  sold_quantity?: number | string | null;
  tags?: string | null;
  sku?: string | null;
  image?: string | null;
  local_image?: string | null;
  image_url?: string | null;
  original_image?: string | null;
  product_url?: string | null;
  custom_url?: string | null;
};

const DATA_URLS = ['/assets/images/warehouse_products.json', '/assets/images/warehouse_products.jsonl'];

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseJsonLines = (text: string): Product[] =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .flatMap((line, index) => {
      try {
        const parsed = JSON.parse(line);
        return isObject(parsed) ? [parsed as Product] : [];
      } catch {
        console.warn(`Bad JSONL line #${index + 1}`);
        return [];
      }
    });

const parseWarehouseText = (text: string): Product[] => {
  const trimmed = text.trim();
  if (!trimmed) return [];

  if (trimmed.startsWith('[')) {
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? (parsed.filter(isObject) as Product[]) : [];
    } catch (error) {
      throw new Error(`Failed to parse warehouse JSON: ${(error as Error).message}`);
    }
  }

  return parseJsonLines(trimmed);
};

export async function loadWarehouseProducts(): Promise<Product[]> {
  let response: Response | null = null;

  for (const url of DATA_URLS) {
    const res = await fetch(url, { cache: 'no-store' });
    if (res.ok) {
      response = res;
      break;
    }
  }

  if (!response) {
    throw new Error(`Failed to load warehouse data from ${DATA_URLS.join(', ')}`);
  }

  const text = await response.text();
  return parseWarehouseText(text);
}
