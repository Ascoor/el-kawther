import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Drumstick, Wheat, Milk, Boxes, IceCream, Fish, Beef, Carrot, Apple, Egg, Sandwich } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { getCategoryThemeClass } from '@/lib/categoryStyles';

interface CategoryTileProps {
  category: Category;
  productCount?: number;
}

const categoryIconSets: Record<string, React.ElementType[]> = {
  frozen: [Snowflake, IceCream, Fish],
  meat: [Drumstick, Beef],
  grocery: [Wheat, Carrot, Apple, Sandwich],
  dairy: [Milk, Egg],
};

const getSemanticIcon = (token: string, categorySlug: string): React.ElementType => {
  const icons = categoryIconSets[token];
  if (!icons?.length) return Boxes;
  const hash = categorySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return icons[hash % icons.length];
};

export function CategoryTile({ category, productCount }: CategoryTileProps) {
  const { isArabic } = useLanguage();

  const token = category.colorToken || 'grocery';
  const Icon = getSemanticIcon(token, category.slug || category.id);
  const categoryClass = getCategoryThemeClass(token);

  const name = (isArabic ? category.name_ar : category.name_en) || category.name_en || category.name_ar;

  return (
    <Link to={`/products?category=${category.slug || category.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.35 }}
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      >
        <Card
          className={cn(
            'group relative overflow-hidden cursor-pointer border-2 transition-all duration-300',
            'hover:shadow-xl hover:shadow-primary/5',
            'category-surface category-surface-hover category-border category-border-hover',
            categoryClass,
          )}
        >
          <div className={cn('absolute inset-0 opacity-5 pointer-events-none', categoryClass, 'category-base')}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-current blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-current blur-2xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <CardContent className="relative p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <motion.div
              className={cn('relative p-5 rounded-2xl transition-all duration-300 category-icon-bg', categoryClass)}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <div className={cn(
                'absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 category-border',
                categoryClass,
              )} />
              <Icon className={cn('h-12 w-12 transition-transform duration-300 group-hover:scale-110 category-text', categoryClass)} strokeWidth={1.5} />
            </motion.div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {name}
              </h3>
              {productCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  <span className={cn('font-semibold category-text', categoryClass)}>{productCount}</span>{' '}
                  {isArabic ? 'منتج' : 'products'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
