import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Globe,
  Package,
  PackageCheck,
  ShoppingBag,
  Snowflake,
  Sparkles,
  Truck,
} from "lucide-react";
import { motion } from "framer-motion";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { CategoryTile } from "@/components/CategoryTile";
import { FullBleedBackgroundSlider } from "@/components/FullBleedBackgroundSlider";

import { useLanguage } from "@/contexts/LanguageContext";
import { useStore } from "@/contexts/StoreContext";

import { slide1, slide2, slide3, slide4, slide5, slide6 } from "@/assets/slides";

const motionReveal = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true, margin: "-80px" },
};

export default function HomePage() {
  const { t, isArabic } = useLanguage();
  const { products, categories, getProductsByCategory } = useStore();

  const bgSlides = React.useMemo(
    () => [
      { src: slide1, alt: "slide 1" },
      { src: slide2, alt: "slide 2" },
      { src: slide3, alt: "slide 3" },
      { src: slide4, alt: "slide 4" },
      { src: slide5, alt: "slide 5" },
      { src: slide6, alt: "slide 6" },
    ],
    []
  );

  const categoryRows = React.useMemo(
    () =>
      categories.map((cat) => ({
        category: cat,
        productCount: getProductsByCategory(cat.id).length,
      })),
    [categories, getProductsByCategory]
  );

  const featuredProducts = React.useMemo(() => {
    const score = (badges: string[], stockQty: number) => {
      const badgeScore =
        (badges.includes("bestseller") ? 4 : 0) +
        (badges.includes("new") ? 3 : 0) +
        (badges.includes("offer") ? 2 : 0);
      return badgeScore + Math.min(stockQty / 10, 3);
    };

    return [...products]
      .sort((a, b) => {
        const scoreDiff = score(b.badges, b.stockQty) - score(a.badges, a.stockQty);
        if (scoreDiff !== 0) return scoreDiff;
        return b.stockQty - a.stockQty;
      })
      .slice(0, 12);
  }, [products]);

  const benefits = React.useMemo(
    () => [
      {
        icon: Truck,
        title: t("home.benefit1.title"),
        desc: t("home.benefit1.desc"),
      },
      {
        icon: Snowflake,
        title: t("home.benefit2.title"),
        desc: t("home.benefit2.desc"),
      },
      {
        icon: Award,
        title: t("home.benefit3.title"),
        desc: t("home.benefit3.desc"),
      },
    ],
    [t]
  );

  const trustItems = React.useMemo(
    () => [
      {
        icon: Snowflake,
        title: isArabic ? "سلسلة تبريد" : "Cold Chain",
        desc: isArabic ? "معايير تبريد دقيقة" : "Precise temperature control",
      },
      {
        icon: Truck,
        title: isArabic ? "شحن سريع" : "Fast Shipping",
        desc: isArabic ? "توصيل موثوق لكل المدن" : "Reliable delivery nationwide",
      },
      {
        icon: BadgeCheck,
        title: isArabic ? "جودة معتمدة" : "Certified Quality",
        desc: isArabic ? "مصادر موثوقة عالمياً" : "Trusted global sourcing",
      },
      {
        icon: PackageCheck,
        title: isArabic ? "أسعار الجملة" : "Bulk Pricing",
        desc: isArabic ? "خيارات توريد للشركات" : "Wholesale-friendly offers",
      },
    ],
    [isArabic]
  );

  const worldStores = React.useMemo(
    () => [
      {
        icon: Globe,
        title: isArabic ? "البحر المتوسط" : "Mediterranean",
        desc: isArabic ? "زيت زيتون، جبن، توابل" : "Olive oil, cheese, spices",
      },
      {
        icon: ShoppingBag,
        title: isArabic ? "الخليج" : "Gulf",
        desc: isArabic ? "تمور فاخرة وبقالة ممتازة" : "Premium dates & pantry",
      },
      {
        icon: Sparkles,
        title: isArabic ? "بلاد الشام" : "Levant",
        desc: isArabic ? "نكهات أصيلة ومختارة" : "Authentic regional flavors",
      },
      {
        icon: Package,
        title: isArabic ? "مخزن آسيا" : "Asian Pantry",
        desc: isArabic ? "صلصات، أرز، نودلز" : "Sauces, rice, noodles",
      },
      {
        icon: BadgeCheck,
        title: isArabic ? "أوروبا" : "European",
        desc: isArabic ? "منتجات مختارة بعناية" : "Curated European staples",
      },
      {
        icon: Snowflake,
        title: isArabic ? "مشروبات ووجبات" : "Beverages & Snacks",
        desc: isArabic ? "مشروبات خفيفة وسناكات" : "Refreshments & treats",
      },
    ],
    [isArabic]
  );

  return (
    <Layout>
      {/* HERO: Full-bleed slider with bottom anchored overlay */}
      <section className="relative">
        <FullBleedBackgroundSlider
          images={bgSlides}
          isArabic={isArabic}
          autoMs={5500}
          className={[
            "rounded-none",
            "h-[70svh] min-h-[420px] max-h-[760px]",
          ].join(" ")}
          showArrows
          showDots
        />
        <div className="absolute inset-x-0 bottom-0">
          <div className="container pb-8 md:pb-12">
            <motion.div
              className={[
                "max-w-3xl rounded-2xl border border-white/15 bg-black/35 p-6 md:p-8 backdrop-blur",
                isArabic ? "text-right" : "text-left",
              ].join(" ")}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="bg-white/15 text-white">
                  {isArabic ? "توريد موثوق" : "Trusted Supply"}
                </Badge>
                <Badge variant="secondary" className="bg-white/15 text-white">
                  {isArabic ? "توصيل سريع" : "Fast Delivery"}
                </Badge>
                <Badge variant="secondary" className="bg-white/15 text-white">
                  {isArabic ? "جودة مضمونة" : "Quality Guaranteed"}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                {t("home.hero.title")}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-white/90 max-w-2xl">
                {t("home.hero.subtitle")}
              </p>
              <div
                className={[
                  "mt-6 flex flex-col sm:flex-row gap-3",
                  isArabic ? "sm:flex-row-reverse" : "sm:flex-row",
                ].join(" ")}
              >
                <Link to="/products" aria-label={t("home.hero.cta")}>
                  <Button size="lg" className="text-base">
                    {t("home.hero.cta")}
                  </Button>
                </Link>
                <Link to="/categories" aria-label={t("nav.categories")}>
                  <Button size="lg" variant="secondary" className="text-base">
                    {t("nav.categories")}
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* QUICK TRUST STRIP */}
      <section className="py-8 md:py-10 bg-background">
        <div className="container">
          <motion.div
            {...motionReveal}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {trustItems.map((item) => (
              <Card key={item.title} className="border-muted/40 shadow-sm">
                <CardContent className="p-5 flex items-start gap-4">
                  <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURED CATEGORIES */}
      <section className="py-10 sm:py-14 md:py-16 bg-background">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("home.categories.title")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isArabic
                  ? "اكتشف الأقسام الأكثر طلباً حول العالم"
                  : "Explore top aisles from our world markets"}
              </p>
            </div>
            <Link
              to="/categories"
              className="text-primary hover:underline flex items-center gap-1"
              aria-label={t("nav.categories")}
            >
              {t("common.viewAll")}
              <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <Tabs defaultValue="all" dir={isArabic ? "rtl" : "ltr"} className="mb-6">
            <TabsList aria-label={isArabic ? "تصفية الأقسام" : "Category filter"}>
              <TabsTrigger value="all">{isArabic ? "الكل" : "All"}</TabsTrigger>
              <TabsTrigger value="top">{isArabic ? "الأعلى" : "Top"}</TabsTrigger>
              <TabsTrigger value="new">{isArabic ? "وصلت حديثاً" : "New Arrivals"}</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {categoryRows.map((row) => (
              <CategoryTile
                key={row.category.id}
                category={row.category}
                productCount={row.productCount}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CURATED FEATURED PRODUCTS */}
      <section className="py-10 sm:py-14 md:py-16 bg-secondary/30">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {t("home.featured.title")}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isArabic
                  ? "منتجات مختارة بعناية مع عروض مميزة"
                  : "Curated picks with premium availability"}
              </p>
            </div>
            <Link
              to="/products"
              className="text-primary hover:underline flex items-center gap-1"
              aria-label={t("nav.products")}
            >
              {t("common.viewAll")}
              <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <Tabs defaultValue="newest" dir={isArabic ? "rtl" : "ltr"}>
              <TabsList aria-label={isArabic ? "فرز المنتجات" : "Product sort"}>
                <TabsTrigger value="newest">{isArabic ? "الأحدث" : "Newest"}</TabsTrigger>
                <TabsTrigger value="bestsellers">{isArabic ? "الأكثر مبيعاً" : "Best Sellers"}</TabsTrigger>
                <TabsTrigger value="deals">{isArabic ? "عروض" : "Deals"}</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              <span>{isArabic ? "تشكيلة موسمية مميزة" : "Seasonal premium selection"}</span>
            </div>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {Array.from({ length: 10 }).map((_, idx) => (
                <Skeleton key={idx} className="h-52 w-full rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* NEW SHIPMENT PROMO */}
      <section className="py-8 sm:py-10">
        <div className="container">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/15 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "وصلت للتو" : "Just landed"}
                </p>
                <h3 className="text-xl md:text-2xl font-semibold">
                  {t("home.newshipment")}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isArabic
                    ? "اطلب أحدث المنتجات العالمية قبل نفاد الكمية"
                    : "Order the latest global products before they sell out"}
                </p>
              </div>
            </div>
            <Link to="/products?sort=newest" aria-label={t("filter.sort.newest")}>
              <Button size="lg" className="gap-2">
                {isArabic ? "تسوق الشحنة" : "Shop the shipment"}
                <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-10 sm:py-14 md:py-16 bg-background">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              {t("home.benefits.title")}
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              {isArabic
                ? "خدمات مخصصة لسلاسل الإمداد والتجزئة"
                : "Purpose-built for wholesale and retail supply chains"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {benefits.map((benefit) => (
              <motion.div key={benefit.title} whileHover={{ y: -6 }}>
                <Card className="h-full shadow-sm">
                  <CardContent className="pt-7 pb-6 px-6 space-y-4">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="h-7 w-7 md:h-8 md:w-8 text-primary" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold">{benefit.title}</h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {benefit.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLD STORES SECTION */}
      <section className="py-12 sm:py-14 md:py-16 bg-secondary/40">
        <div className="container">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">
                {isArabic ? "أسواق العالم" : "World Stores"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {isArabic
                  ? "أقسام عالمية لمنتجات مختارة"
                  : "Region-inspired aisles curated for you"}
              </p>
            </div>
            <Link
              to="/categories"
              className="text-primary hover:underline flex items-center gap-1"
              aria-label={t("nav.categories")}
            >
              {t("common.viewAll")}
              <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {worldStores.map((store) => (
              <motion.div key={store.title} {...motionReveal}>
                <Card className="h-full border-muted/50 bg-background/80">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <store.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{store.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{store.desc}</p>
                    </div>
                    <Separator />
                    <Link
                      to="/categories"
                      className="text-primary text-sm font-medium inline-flex items-center gap-1"
                      aria-label={isArabic ? "تصفح القسم" : "Browse aisle"}
                    >
                      {isArabic ? "تصفح القسم" : "Browse aisle"}
                      <ArrowRight className={`h-4 w-4 ${isArabic ? "rotate-180" : ""}`} />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container">
          <motion.div
            {...motionReveal}
            className={[
              "text-center space-y-5 md:space-y-6",
              isArabic ? "text-right md:text-center" : "text-left md:text-center",
            ].join(" ")}
          >
            <h2 className="text-2xl md:text-4xl font-bold">
              {isArabic ? "جاهز لتجربة أسواق الكوثر؟" : "Ready for the El-Kawther experience?"}
            </h2>
            <p className="text-base md:text-xl opacity-90 max-w-2xl mx-auto">
              {isArabic
                ? "انضم إلى شركائنا واستمتع بتوريد مستقر وجودة عالمية." 
                : "Join our partners and enjoy stable supply with global-quality goods."}
            </p>
            <Link to="/products" aria-label={t("home.hero.cta")}>
              <Button size="lg" variant="secondary" className="text-lg">
                {t("home.hero.cta")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
