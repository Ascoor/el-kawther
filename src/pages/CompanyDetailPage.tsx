import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/loaders';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { filterAndSortProducts, SortOption } from '@/lib/products/productFilters';

export default function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const { t, isArabic } = useLanguage();
  const { companies, products, categories } = useStore();

  const company = companies.find((item) => item.id === companyId);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [frozenOnly, setFrozenOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const filteredProducts = useMemo(
    () =>
      filterAndSortProducts(products, {
        search,
        categoryId: selectedCategory,
        companyId: companyId ?? 'all',
        inStockOnly,
        frozenOnly,
        sortBy,
      }),
    [products, search, selectedCategory, companyId, inStockOnly, frozenOnly, sortBy],
  );

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setInStockOnly(false);
    setFrozenOnly(false);
    setSortBy('newest');
  };

  const hasFilters = search || selectedCategory !== 'all' || inStockOnly || frozenOnly;
  const isLoading = products.length === 0 && companies.length === 0;

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('filter.category')}</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('cat.all')}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {isArabic ? cat.name_ar : cat.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('filter.availability')}</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="inStockCompany"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
            />
            <Label htmlFor="inStockCompany" className="text-sm cursor-pointer">
              {t('filter.inStockOnly')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="frozenCompany"
              checked={frozenOnly}
              onCheckedChange={(checked) => setFrozenOnly(checked as boolean)}
            />
            <Label htmlFor="frozenCompany" className="text-sm cursor-pointer">
              {t('filter.frozenOnly')}
            </Label>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('filter.sort')}</Label>
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('filter.sort.newest')}</SelectItem>
            <SelectItem value="priceAsc">{t('filter.sort.priceAsc')}</SelectItem>
            <SelectItem value="priceDesc">{t('filter.sort.priceDesc')}</SelectItem>
            <SelectItem value="bestselling">{t('filter.sort.bestselling')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 me-2" />
          {t('filter.clear')}
        </Button>
      )}
    </div>
  );

  if (!isLoading && !company) {
    return (
      <Layout>
        <div className="container py-16 text-center space-y-4">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
          <Button asChild variant="outline">
            <Link to="/companies">{t('common.back')}</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">{company?.name}</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} {isArabic ? 'منتج' : 'products'}
            </p>
          </div>
          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('filter.search')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="ps-9"
              />
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isArabic ? 'right' : 'left'}>
                <SheetHeader>
                  <SheetTitle>{t('filter.title')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">{t('filter.title')}</h3>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <ProductCardSkeleton count={12} />
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{t('common.noResults')}</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  {t('filter.clear')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
