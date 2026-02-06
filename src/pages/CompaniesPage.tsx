import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';

export default function CompaniesPage() {
  const { t, isArabic } = useLanguage();
  const { companies, products } = useStore();
  const [search, setSearch] = useState('');

  const filteredCompanies = useMemo(() => {
    if (!search) return companies;
    const lowered = search.toLowerCase();
    return companies.filter((company) => company.name.toLowerCase().includes(lowered));
  }, [companies, search]);

  const isLoading = companies.length === 0 && products.length === 0;

  return (
    <Layout>
      <div className="container py-12 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{t('companies.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {filteredCompanies.length} {isArabic ? 'شركة' : 'companies'}
            </p>
          </div>
          <div className="w-full md:max-w-sm">
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={isArabic ? 'بحث عن شركة...' : 'Search companies...'}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={`company-skeleton-${index}`} className="animate-pulse">
                <CardContent className="p-6 space-y-4">
                  <div className="h-5 w-1/2 rounded bg-muted" />
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                  <div className="h-9 w-32 rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {t('common.noResults')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <Card key={company.id} className="h-full">
                <CardContent className="p-6 flex flex-col gap-4">
                  <div>
                    <h2 className="text-lg font-semibold">{company.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {company.productsCount} {isArabic ? 'منتج' : 'products'}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {company.topCategories.slice(0, 2).map((category) => category.name).join(' · ') ||
                      t('common.noResults')}
                  </div>
                  <div className="mt-auto">
                    <Button asChild className="w-full">
                      <Link to={`/companies/${company.id}`}>
                        {t('companies.products')}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
