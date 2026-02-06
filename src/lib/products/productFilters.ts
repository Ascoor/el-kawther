import type { Product } from '@/types';

export type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'bestselling';

export type ProductFilterOptions = {
  search?: string;
  categoryId?: string;
  companyId?: string;
  inStockOnly?: boolean;
  frozenOnly?: boolean;
  sortBy?: SortOption;
};

export const filterAndSortProducts = (products: Product[], options: ProductFilterOptions) => {
  const {
    search = '',
    categoryId = 'all',
    companyId = 'all',
    inStockOnly = false,
    frozenOnly = false,
    sortBy = 'newest',
  } = options;

  let result = [...products];

  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name_ar.toLowerCase().includes(searchLower) ||
        p.name_en.toLowerCase().includes(searchLower) ||
        p.desc_ar.toLowerCase().includes(searchLower) ||
        p.desc_en.toLowerCase().includes(searchLower),
    );
  }

  if (categoryId && categoryId !== 'all') {
    result = result.filter((p) => p.categoryId === categoryId);
  }

  if (companyId && companyId !== 'all') {
    result = result.filter((p) => p.companyId === companyId);
  }

  if (inStockOnly) {
    result = result.filter((p) => p.stockQty > 0);
  }

  if (frozenOnly) {
    result = result.filter((p) => p.isFrozen);
  }

  switch (sortBy) {
    case 'priceAsc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'priceDesc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'bestselling':
      result.sort((a, b) => {
        const aIsBest = a.badges.includes('bestseller') ? 1 : 0;
        const bIsBest = b.badges.includes('bestseller') ? 1 : 0;
        return bIsBest - aIsBest;
      });
      break;
    case 'newest':
    default:
      result.sort((a, b) => {
        const aIsNew = a.badges.includes('new') ? 1 : 0;
        const bIsNew = b.badges.includes('new') ? 1 : 0;
        return bIsNew - aIsNew;
      });
  }

  return result;
};
