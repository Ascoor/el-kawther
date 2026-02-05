import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin, ChevronLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useStore } from '@/contexts/StoreContext';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';

export function Footer() {
  const { t, isArabic } = useLanguage();
  const { isDark } = useTheme();
  const { categories } = useStore();

  const orderedCategories = useMemo(() => {
    const sorted = [...categories];
    sorted.sort((a, b) => {
      const nameA = (isArabic ? a.name_ar : a.name_en) || a.name_en || a.name_ar;
      const nameB = (isArabic ? b.name_ar : b.name_en) || b.name_en || b.name_ar;
      return nameA.localeCompare(nameB, isArabic ? 'ar' : 'en');
    });
    return sorted;
  }, [categories, isArabic]);

  const footerCategoryLinks = useMemo(
    () =>
      orderedCategories.slice(0, 8).map((category) => ({
        id: category.id,
        name: (isArabic ? category.name_ar : category.name_en) || category.name_en || category.name_ar,
        href: `/products?category=${category.slug || category.id}`,
      })),
    [orderedCategories, isArabic]
  );

  const quickLinks = useMemo(
    () => [
      { href: '/products', label: t('nav.products') },
      { href: '/categories', label: t('nav.categories') },
      { href: '/about', label: t('nav.about') },
      { href: '/contact', label: t('nav.contact') },
    ],
    [t]
  );

  return (
    <footer
      className="relative overflow-hidden border-t border-border/60 bg-background"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,hsl(var(--accent)/0.18),transparent_60%),radial-gradient(120%_90%_at_10%_0%,hsl(var(--primary)/0.18),transparent_62%)]" />
        <div className="absolute inset-0 bg-[url('/src/assets/noise.png')] opacity-[0.08] mix-blend-soft-light" />
      </div>

      <div className="container relative py-14 lg:py-16">
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <img
              src={isDark ? logoDark : logoLight}
              alt={t('brand.name')}
              className="h-12 w-auto"
            />
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('brand.tagline')}
            </p>
            <p className="text-sm text-foreground/80 font-medium">
              {isArabic ? 'أسواق عالمية للأغذية' : 'World Stores / Global Food Markets'}
            </p>
          </div>

          <div className={isArabic ? 'text-right' : 'text-left'}>
            <h4 className="text-base font-semibold text-foreground mb-4">{t('nav.categories')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerCategoryLinks.length > 0 ? (
                footerCategoryLinks.map((category) => (
                  <li key={category.id}>
                    <Link
                      to={category.href}
                      className="transition-colors hover:text-accent"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-xs text-muted-foreground">{t('common.noResults')}</li>
              )}
              <li>
                <Link
                  to="/categories"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                >
                  {isArabic ? 'عرض كل الأقسام' : 'View all categories'}
                  <ChevronLeft className={`h-4 w-4 ${isArabic ? '' : 'rotate-180'}`} />
                </Link>
              </li>
            </ul>
          </div>

          <div className={isArabic ? 'text-right' : 'text-left'}>
            <h4 className="text-base font-semibold text-foreground mb-4">{isArabic ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="transition-colors hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={isArabic ? 'text-right' : 'text-left'}>
            <h4 className="text-base font-semibold text-foreground mb-4">{t('nav.contact')}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                <Phone className="h-4 w-4 text-accent" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                <MessageCircle className="h-4 w-4 text-accent" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                <Mail className="h-4 w-4 text-accent" />
                <span>info@elkawther.com</span>
              </li>
              <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                <MapPin className="h-4 w-4 text-accent" />
                <span>{isArabic ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:hidden">
          <Accordion type="single" collapsible className="w-full space-y-4">
            <div className="space-y-4">
              <img
                src={isDark ? logoDark : logoLight}
                alt={t('brand.name')}
                className="h-12 w-auto"
              />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('brand.tagline')}
              </p>
              <p className="text-sm text-foreground/80 font-medium">
                {isArabic ? 'أسواق عالمية للأغذية' : 'World Stores / Global Food Markets'}
              </p>
            </div>

            <AccordionItem value="categories" className="border-border/50">
              <AccordionTrigger className={isArabic ? 'text-right' : 'text-left'}>
                {t('nav.categories')}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {footerCategoryLinks.length > 0 ? (
                    footerCategoryLinks.map((category) => (
                      <li key={category.id}>
                        <Link to={category.href} className="transition-colors hover:text-accent">
                          {category.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-muted-foreground">{t('common.noResults')}</li>
                  )}
                  <li>
                    <Link
                      to="/categories"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-accent"
                    >
                      {isArabic ? 'عرض كل الأقسام' : 'View all categories'}
                      <ChevronLeft className={`h-4 w-4 ${isArabic ? '' : 'rotate-180'}`} />
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="links" className="border-border/50">
              <AccordionTrigger className={isArabic ? 'text-right' : 'text-left'}>
                {isArabic ? 'روابط سريعة' : 'Quick Links'}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className="transition-colors hover:text-accent">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="contact" className="border-border/50">
              <AccordionTrigger className={isArabic ? 'text-right' : 'text-left'}>
                {t('nav.contact')}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                    <Phone className="h-4 w-4 text-accent" />
                    <span dir="ltr">+20 123 456 7890</span>
                  </li>
                  <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                    <MessageCircle className="h-4 w-4 text-accent" />
                    <span dir="ltr">+20 123 456 7890</span>
                  </li>
                  <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                    <Mail className="h-4 w-4 text-accent" />
                    <span>info@elkawther.com</span>
                  </li>
                  <li className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse justify-end' : ''}`}>
                    <MapPin className="h-4 w-4 text-accent" />
                    <span>{isArabic ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="border-t border-border/60 mt-10 pt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/shipping-policy" className="transition-colors hover:text-accent">
              {t('footer.shipping')}
            </Link>
            <Link to="/returns-policy" className="transition-colors hover:text-accent">
              {t('footer.returns')}
            </Link>
            <span className="text-xs uppercase tracking-[0.2em] text-foreground/70">
              {isArabic ? 'AR' : 'EN'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
