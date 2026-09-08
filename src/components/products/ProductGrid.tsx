"use client";

import React, { useState, useMemo } from "react";
import type { ProductType } from "@/types";
import { ProductCard } from "./ProductCard";
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  CheckCircle2,
  Grid2X2,
  ListFilter,
} from "lucide-react";

interface ProductGridProps {
  products: ProductType[];
  locale: "ar" | "en";
  initialCategory?: string;
}

export function ProductGrid({
  products,
  locale,
  initialCategory = "all",
}: ProductGridProps) {
  const isAr = locale === "ar";
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [onlyFeatured, setOnlyFeatured] = useState<boolean>(false);

  // Dynamic Category Counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: products.length,
      bestsellers: products.filter((p) => p.isFeatured).length,
      beauty: 0,
      fashion: 0,
    };

    products.forEach((p) => {
      const slug = p.category?.slug || p.categoryId;
      if (slug.includes("beauty")) counts.beauty += 1;
      if (slug.includes("fashion")) counts.fashion += 1;
    });

    return counts;
  }, [products]);

  const categories = useMemo(() => {
    return [
      {
        id: "all",
        name: isAr ? "جميع المنتجات" : "All Products",
        count: categoryCounts.all,
      },
      {
        id: "bestsellers",
        name: isAr ? "الأكثر طلباً 🔥" : "Best Sellers 🔥",
        count: categoryCounts.bestsellers,
      },
      {
        id: "beauty",
        name: isAr ? "مستحضرات التجميل والعناية" : "Beauty & Care",
        count: categoryCounts.beauty,
      },
      {
        id: "fashion",
        name: isAr ? "الملابس والعبايات" : "Fashion & Abayas",
        count: categoryCounts.fashion,
      },
    ];
  }, [isAr, categoryCounts]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Category check
      const matchesCategory =
        selectedCategory === "all" ||
        (selectedCategory === "bestsellers" && p.isFeatured) ||
        p.category?.slug === selectedCategory ||
        (selectedCategory === "beauty" && p.categoryId.includes("beauty")) ||
        (selectedCategory === "fashion" && p.categoryId.includes("fashion"));

      // Search query check
      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        p.nameAr.toLowerCase().includes(query) ||
        p.nameEn.toLowerCase().includes(query) ||
        p.descAr.toLowerCase().includes(query) ||
        p.descEn.toLowerCase().includes(query);

      // Featured only toggle
      const matchesFeatured = !onlyFeatured || p.isFeatured;

      return matchesCategory && matchesQuery && matchesFeatured;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "price-asc") {
        return Number(a.basePrice) - Number(b.basePrice);
      }
      if (sortBy === "price-desc") {
        return Number(b.basePrice) - Number(a.basePrice);
      }
      if (sortBy === "name") {
        return (isAr ? a.nameAr : a.nameEn).localeCompare(isAr ? b.nameAr : b.nameEn);
      }
      // "featured" default
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, onlyFeatured, isAr]);

  const resetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("featured");
    setOnlyFeatured(false);
  };

  return (
    <div className="space-y-6">
      {/* Category Tabs, Search Bar & Sort Filter */}
      <div className="space-y-4">
        {/* Category Pills Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black shrink-0 transition-all flex items-center gap-2 active:scale-95 ${
                  active
                    ? "bg-neutral-950 text-gold-400 dark:bg-gold-500 dark:text-neutral-950 shadow-md ring-2 ring-gold-500/30"
                    : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-mono font-bold ${
                    active
                      ? "bg-gold-500/20 text-gold-300 dark:bg-neutral-900 dark:text-gold-400"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Sort Dropdown & Quick Toggles */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Real-time search bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={isAr ? "ابحث عن عطر، عباية، أحمر شفاه، سيروم..." : "Search perfume, abaya, lipstick..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-9 py-2.5 rounded-2xl border border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs sm:text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition shadow-2xs"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute top-3 start-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-white absolute top-2.5 end-3 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Controls: Sort Dropdown & Featured Toggle */}
          <div className="flex items-center gap-2">
            {/* Sort Selector */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full sm:w-auto text-xs font-bold py-2.5 ps-8 pe-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer shadow-2xs appearance-none"
              >
                <option value="featured">{isAr ? "المختارات المميزة" : "Featured Picks"}</option>
                <option value="price-asc">{isAr ? "السعر: الأقل أولاً" : "Price: Low to High"}</option>
                <option value="price-desc">{isAr ? "السعر: الأعلى أولاً" : "Price: High to Low"}</option>
                <option value="name">{isAr ? "الترتيب الأبجدي" : "Alphabetical"}</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute top-3.5 start-2.5 pointer-events-none" />
            </div>

            {/* Featured Only Filter Chip */}
            <button
              type="button"
              onClick={() => setOnlyFeatured(!onlyFeatured)}
              className={`px-3 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 ${
                onlyFeatured
                  ? "bg-gold-500 text-neutral-950 ring-2 ring-gold-500/30"
                  : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? "الحصري فقط" : "Exclusive"}</span>
            </button>
          </div>
        </div>

        {/* Live Filter Summary Bar */}
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-1">
          <div className="flex items-center gap-2">
            <span>
              {isAr
                ? `عرض ${filteredAndSortedProducts.length} من أصل ${products.length} منتج فاخر`
                : `Showing ${filteredAndSortedProducts.length} of ${products.length} luxury items`}
            </span>
            {(selectedCategory !== "all" || searchQuery || onlyFeatured || sortBy !== "featured") && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-gold-600 dark:text-gold-400 font-bold hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <span>{isAr ? "إعادة الضبط" : "Reset"}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid: 2 columns on Mobile, 3 on Tablet, 4 on Laptop/Desktop */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60 p-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-neutral-900 dark:text-white text-base">
              {isAr ? "لم نعثر على أي منتج يطابق بحثك" : "No products found matching your search"}
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              {isAr
                ? "يرجى التحقق من الكلمات المكتوبة أو تصفح جميع الأقسام الفاخرة لاكتشاف التشكيلة الكاملة."
                : "Check your search terms or view all categories to discover the full collection."}
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-2xl bg-gold-500 text-neutral-950 font-bold text-xs hover:bg-gold-600 transition shadow-md"
          >
            {isAr ? "عرض جميع المنتجات" : "View All Products"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
