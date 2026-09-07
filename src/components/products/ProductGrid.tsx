"use client";

import React, { useState, useMemo } from "react";
import type { ProductType } from "@/types";
import { ProductCard } from "./ProductCard";
import { Search, Sparkles, SlidersHorizontal } from "lucide-react";

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

  const categories = useMemo(() => {
    return [
      { id: "all", name: isAr ? "جميع المنتجات" : "All Products" },
      { id: "beauty", name: isAr ? "مستحضرات التجميل والعناية" : "Beauty & Cosmetics" },
      { id: "fashion", name: isAr ? "الملابس والأزياء" : "Fashion & Apparel" },
    ];
  }, [isAr]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === "all" ||
        p.category?.slug === selectedCategory ||
        (selectedCategory === "beauty" && p.categoryId.includes("beauty")) ||
        (selectedCategory === "fashion" && p.categoryId.includes("fashion"));

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        p.nameAr.toLowerCase().includes(query) ||
        p.nameEn.toLowerCase().includes(query) ||
        p.descAr.toLowerCase().includes(query) ||
        p.descEn.toLowerCase().includes(query);

      return matchesCategory && matchesQuery;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filters & Search Header */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  active
                    ? "bg-neutral-900 text-white dark:bg-gold-500 dark:text-neutral-950 shadow-md"
                    : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder={isAr ? "ابحث عن منتج، عطر، عباية..." : "Search product, parfum, abaya..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 transition shadow-2xs"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute top-2.5 start-3" />
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-3xl border border-neutral-200/60 dark:border-neutral-800/60">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
            {isAr ? "لم نجد منتجات تطابق بحثك" : "No products found matching your search"}
          </h4>
          <p className="text-xs text-neutral-500">
            {isAr
              ? "جرب البحث بكلمات أخرى أو اختر فئة مختلفة."
              : "Try adjusting your search terms or selecting a different category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
