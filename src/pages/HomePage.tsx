import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Truck,
  Snowflake,
  Award,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { CategoryTile } from '@/components/CategoryTile';

import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { useTheme } from '@/contexts/ThemeContext';

import patternLight from '@/assets/pattern-light.png';
import patternDark from '@/assets/pattern-dark.png';

import { slide1, slide2, slide3, slide6, slide7 } from '@/assets/slides';


export default function HomePage() {
  const { t, isArabic } = useLanguage();
  const { isDark } = useTheme();
  const { products, categories, getProductsByCategory } = useStore();

  const featuredProducts = products
    .filter(p => p.badges.includes('bestseller') || p.badges.includes('new'))
    .slice(0, 8);

  const getCategoryCount = (catId: string) => getProductsByCategory(catId).length;

  const benefits = [
    { icon: Truck, title: t('home.benefit1.title'), desc: t('home.benefit1.desc') },
    { icon: Snowflake, title: t('home.benefit2.title'), desc: t('home.benefit2.desc') },
    { icon: Award, title: t('home.benefit3.title'), desc: t('home.benefit3.desc') },
  ];

  const heroSlides = [
    {
      image: slide1,
      alt: isArabic ? 'خضروات مجمدة' : 'Frozen mixed vegetables',
      kicker: isArabic ? 'خضروات مجمدة' : 'Frozen Essentials',
      title: isArabic ? 'نكهات طازجة لمدة أطول' : 'Freshness that lasts',
      description: isArabic
        ? 'خضروات مختارة بعناية تُحفظ بأعلى جودة.'
        : 'Carefully selected veggies preserved at peak quality.',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.82), rgba(13, 148, 136, 0.55) 45%, rgba(6, 78, 59, 0.4))',
    },
    {
      image: slide2,
      alt: isArabic ? 'لحم بقري' : 'Beef cubes',
      kicker: isArabic ? 'لحوم مختارة' : 'Prime Cuts',
      title: isArabic ? 'مصادر موثوقة وجودة عالية' : 'Trusted sourcing, rich flavor',
      description: isArabic
        ? 'قطع لحم بقري مثالية للطبخ اليومي.'
        : 'Premium beef cuts ready for everyday meals.',
      gradient: 'linear-gradient(135deg, rgba(153, 27, 27, 0.82), rgba(190, 24, 93, 0.55) 45%, rgba(88, 28, 135, 0.35))',
    },
    {
      image: slide3,
      alt: isArabic ? 'مكرونة ريچينا' : 'Regina spaghetti',
      kicker: isArabic ? 'أساسيات المطبخ' : 'Pantry Staples',
      title: isArabic ? 'مكونات يومية بطعم احترافي' : 'Everyday ingredients, pro taste',
      description: isArabic
        ? 'مكرونة ممتازة جاهزة لأشهى الوصفات.'
        : 'Premium pasta for comforting recipes.',
      gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.8), rgba(234, 88, 12, 0.55) 45%, rgba(124, 45, 18, 0.35))',
    },
  ];

  // ====== HERO SLIDER LOGIC ======
  const AUTO_MS = 6000;
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  const total = heroSlides.length;

  const goTo = React.useCallback((idx: number) => {
    const safe = ((idx % total) + total) % total;
    setActive(safe);
  }, [total]);

  const next = React.useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = React.useCallback(() => goTo(active - 1), [active, goTo]);

  React.useEffect(() => {
    if (paused || total <= 1) return;
    const id = window.setInterval(() => {
      setActive(prevIdx => (prevIdx + 1) % total);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, total]);

  // Touch / swipe
  const startXRef = React.useRef<number | null>(null);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    startXRef.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const startX = startXRef.current;
    const endX = e.changedTouches[0]?.clientX ?? null;
    startXRef.current = null;

    if (startX == null || endX == null) return;
    const dx = endX - startX;
    if (Math.abs(dx) < 40) return; // swipe threshold

    // dx > 0 means swipe right
    if (dx > 0) {
      isArabic ? next() : prev();
    } else {
      isArabic ? prev() : next();
    }
  };

  // Keyboard (optional)
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') (isArabic ? prev : next)();
      if (e.key === 'ArrowLeft') (isArabic ? next : prev)();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isArabic, next, prev]);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${isDark ? patternDark : patternLight})`,
            backgroundSize: '300px',
          }}
        />

        {/* side decorative images */}
        <img src={slide6} alt="" className="hero-side-image hero-side-left" aria-hidden="true" />
        <img src={slide7} alt="" className="hero-side-image hero-side-right" aria-hidden="true" />

        <div className="container relative py-20 md:py-32 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] items-center">
            {/* Text */}
            <div className="max-w-2xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-white/80">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                {isArabic ? 'تسوق بذكاء' : 'Shop Smarter'}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {t('home.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl opacity-90">{t('home.hero.subtitle')}</p>

              <div className="grid gap-3 text-base text-white/80 sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <Snowflake className="h-5 w-5 text-emerald-200" />
                  <span>{isArabic ? 'حفظ مثالي للمنتجات' : 'Perfectly preserved quality'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-emerald-200" />
                  <span>{isArabic ? 'توصيل سريع ومبرد' : 'Fast, chilled delivery'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Link to="/products">
                  <Button size="lg" variant="secondary" className="text-lg gap-2">
                    {t('home.hero.cta')}
                    <ArrowRight className={`h-5 w-5 ${isArabic ? 'rotate-180' : ''}`} />
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button size="lg" variant="outline" className="text-lg text-white border-white/40 hover:bg-white/10">
                    {t('home.categories.title')}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Carousel */}
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocusCapture={() => setPaused(true)}
              onBlurCapture={() => setPaused(false)}
            >
              <div
                className="relative h-[300px] sm:h-[340px] md:h-[380px] lg:h-[440px] rounded-3xl overflow-hidden shadow-2xl"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                role="region"
                aria-label={isArabic ? 'سلايدر الصفحة الرئيسية' : 'Homepage hero slider'}
              >
                {/* Slides */}
                {heroSlides.map((slide, idx) => {
                  const isActive = idx === active;
                  return (
                    <div
                      key={slide.alt}
                      aria-hidden={!isActive}
                      className={[
                        'absolute inset-0 transition-all duration-700 ease-out motion-reduce:transition-none',
                        isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03] motion-reduce:scale-100',
                      ].join(' ')}
                    >
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="h-full w-full object-cover"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ backgroundImage: slide.gradient }}
                      />
                      <div className="absolute inset-0 bg-black/15 dark:bg-black/30" />
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          backgroundImage: `url(${isDark ? patternDark : patternLight})`,
                          backgroundSize: '280px',
                        }}
                      />

                      <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                        <div className="max-w-xs space-y-2 text-white">
                          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur">
                            {slide.kicker}
                          </span>
                          <p className="text-lg font-semibold">{slide.title}</p>
                          <p className="text-sm text-white/80">{slide.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Prev / Next */}
                <button
                  type="button"
                  onClick={isArabic ? next : prev}
                  className="absolute top-1/2 -translate-y-1/2 left-3 z-10 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center"
                  aria-label={isArabic ? 'التالي' : 'Previous'}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <button
                  type="button"
                  onClick={isArabic ? prev : next}
                  className="absolute top-1/2 -translate-y-1/2 right-3 z-10 h-11 w-11 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur border border-white/30 flex items-center justify-center"
                  aria-label={isArabic ? 'السابق' : 'Next'}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-2">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goTo(idx)}
                      className={[
                        'h-2.5 rounded-full transition-all',
                        idx === active ? 'w-8 bg-white' : 'w-2.5 bg-white/50 hover:bg-white/70',
                      ].join(' ')}
                      aria-label={(isArabic ? 'انتقل إلى شريحة ' : 'Go to slide ') + (idx + 1)}
                      aria-current={idx === active ? 'true' : 'false'}
                    />
                  ))}
                </div>
              </div>

              {/* Optional small label */}
              <div className="mt-3 text-center text-sm opacity-80">
                {isArabic ? 'اسحب للتنقل بين الشرائح' : 'Swipe to navigate slides'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.categories.title')}</h2>
            <Link to="/categories" className="text-primary hover:underline flex items-center gap-1">
              {t('common.viewAll')}
              <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <CategoryTile
                key={cat.id}
                category={cat}
                productCount={getCategoryCount(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t('home.benefits.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-8 pb-6 px-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Shipment Banner */}
      <section className="py-6 bg-accent text-accent-foreground">
        <div className="container flex items-center justify-center gap-4">
          <Package className="h-6 w-6" />
          <span className="text-lg font-semibold">{t('home.newshipment')}</span>
          <Link to="/products?sort=newest">
            <Button variant="outline" size="sm" className="border-accent-foreground/30 hover:bg-accent-foreground/10">
              {t('common.viewAll')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.featured.title')}</h2>
            <Link to="/products" className="text-primary hover:underline flex items-center gap-1">
              {t('common.viewAll')}
              <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {isArabic ? 'جاهز للطلب؟' : 'Ready to Order?'}
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {isArabic
              ? 'تسوق الآن واستمتع بأفضل المنتجات الغذائية مع توصيل سريع'
              : 'Shop now and enjoy the best food products with fast delivery'}
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="text-lg">
              {t('home.hero.cta')}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
