import React, { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { StoreProvider } from "@/contexts/StoreContext";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { BrandSplashLoader } from "@/components/loaders/BrandSplashLoader";

import HomePage from "./pages/HomePage";

import ProductsPage from "./pages/ProductsPage";
import ProductsGalleryPage from "./pages/ProductsGalleryPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";
import CompaniesPage from "./pages/CompaniesPage";
import CompanyDetailPage from "./pages/CompanyDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrderDetailPage from "./pages/OrderDetailPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ShippingPolicyPage from "./pages/ShippingPolicyPage";
import ReturnsPolicyPage from "./pages/ReturnsPolicyPage";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCoupons from "./pages/admin/AdminCoupons";
import AdminInventory from "./pages/admin/AdminInventory";

const queryClient = new QueryClient();

const App = () => {
  const [appReady, setAppReady] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <StoreProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrandSplashLoader auto onDone={() => setAppReady(true)} />
              {appReady && (
                <BrowserRouter>
                  <ScrollToTop />
                  <Routes>
                    <Route path="/" element={<HomePage />} />

                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products-gallery" element={<ProductsGalleryPage />} />
                    <Route path="/product/:slug" element={<ProductDetailPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/companies/:companyId" element={<CompanyDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
                    <Route path="/order/:orderId" element={<OrderDetailPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                    <Route path="/returns-policy" element={<ReturnsPolicyPage />} />

                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="products" element={<AdminProducts />} />
                      <Route path="inventory" element={<AdminInventory />} />
                      <Route path="coupons" element={<AdminCoupons />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              )}
            </TooltipProvider>
          </StoreProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
