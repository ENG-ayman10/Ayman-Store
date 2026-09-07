"use client";

import React, { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import type { ProductType } from "@/types";
import { createProduct, updateProduct, deleteProduct } from "@/actions/products";
import { uploadImage } from "@/actions/upload";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Sparkles,
  Package,
  Layers,
  Check,
  AlertCircle,
  ImageIcon,
  Upload,
  Camera,
  FolderOpen,
  ImagePlus,
} from "lucide-react";

interface AdminProductsClientProps {
  initialProducts: ProductType[];
  locale: "ar" | "en";
}

const PRESET_IMAGES = [
  { labelAr: "أحمر شفاه", labelEn: "Lipstick", url: "/uploads/lipstick.webp" },
  { labelAr: "عباية فاخرة", labelEn: "Abaya", url: "/uploads/abaya.webp" },
  { labelAr: "عطر ملكي", labelEn: "Royal Oud", url: "/uploads/perfume.webp" },
  { labelAr: "سيروم نضارة", labelEn: "Vitamin C Serum", url: "/uploads/serum.webp" },
  { labelAr: "قفطان حريري", labelEn: "Silk Kaftan", url: "/uploads/dress.webp" },
  { labelAr: "طرحة شيفون", labelEn: "Chiffon Scarf", url: "/uploads/scarf.webp" },
];

export function AdminProductsClient({ initialProducts, locale }: AdminProductsClientProps) {
  const isAr = locale === "ar";
  const [products, setProducts] = useState<ProductType[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  // Upload & Image Source State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imageSourceTab, setImageSourceTab] = useState<"device" | "preset">("device");

  // Form State
  const [formData, setFormData] = useState({
    nameAr: "",
    nameEn: "",
    categoryId: "cat-beauty",
    basePrice: 5000,
    descAr: "",
    descEn: "",
    image: "/uploads/lipstick.webp",
    isFeatured: true,
    variantNameAr: "درجة 01 قياسي",
    variantNameEn: "01 Standard",
    stockQuantity: 20,
  });

  const handleDeviceFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const data = new FormData();
      data.append("file", file);

      const res = await uploadImage(data);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url! }));
      } else {
        setUploadError(res.error || (isAr ? "فشل رفع الصورة من الجهاز" : "Failed to upload image from device"));
      }
    } catch (err) {
      console.error("Device file upload error:", err);
      setUploadError(isAr ? "حدث خطأ غير متوقع أثناء رفع الصورة" : "Error uploading image from device");
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be re-selected if desired
      e.target.value = "";
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        p.nameAr.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.category?.nameAr.toLowerCase().includes(q) ||
        p.category?.nameEn.toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await createProduct({
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        categoryId: formData.categoryId,
        basePrice: Number(formData.basePrice),
        descAr: formData.descAr || "منتج فاخر عالي الجودة من متجر أيمن",
        descEn: formData.descEn || "Luxury high-quality product from Ayman Store",
        images: [formData.image],
        isFeatured: formData.isFeatured,
        variants: [
          {
            attributes: {
              shadeAr: formData.variantNameAr,
              shadeEn: formData.variantNameEn,
              colorCode: "#B8860B",
            },
            stockQuantity: Number(formData.stockQuantity),
          },
        ],
      });

      if (res.success && res.product) {
        setProducts([res.product, ...products]);
        setIsCreateOpen(false);
        // Reset form
        setFormData({
          nameAr: "",
          nameEn: "",
          categoryId: "cat-beauty",
          basePrice: 5000,
          descAr: "",
          descEn: "",
          image: "/uploads/lipstick.webp",
          isFeatured: true,
          variantNameAr: "درجة 01 قياسي",
          variantNameEn: "01 Standard",
          stockQuantity: 20,
        });
      }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    startTransition(async () => {
      await updateProduct(editingProduct.id, {
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
        basePrice: Number(formData.basePrice),
        descAr: formData.descAr,
        descEn: formData.descEn,
        images: [formData.image],
        isFeatured: formData.isFeatured,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                nameAr: formData.nameAr,
                nameEn: formData.nameEn,
                basePrice: Number(formData.basePrice),
                descAr: formData.descAr,
                descEn: formData.descEn,
                images: [formData.image],
                isFeatured: formData.isFeatured,
              }
            : p
        )
      );

      setEditingProduct(null);
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingProductId) return;

    startTransition(async () => {
      await deleteProduct(deletingProductId);
      setProducts((prev) => prev.filter((p) => p.id !== deletingProductId));
      setDeletingProductId(null);
    });
  };

  const openEditModal = (p: ProductType) => {
    setEditingProduct(p);
    const img = p.images[0] || "/uploads/lipstick.webp";
    setUploadError(null);
    setImageSourceTab(img.startsWith("/uploads/upload-") ? "device" : "preset");
    setFormData({
      nameAr: p.nameAr,
      nameEn: p.nameEn,
      categoryId: p.categoryId,
      basePrice: p.basePrice,
      descAr: p.descAr,
      descEn: p.descEn,
      image: img,
      isFeatured: p.isFeatured,
      variantNameAr: p.variants[0]?.attributes.shadeAr || "قياسي",
      variantNameEn: p.variants[0]?.attributes.shadeEn || "Standard",
      stockQuantity: p.variants[0]?.stockQuantity || 15,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder={isAr ? "بحث بالاسم أو الفئة..." : "Search by product name..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-2xs"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute top-3.5 start-3" />
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={() => {
            setFormData({
              nameAr: "",
              nameEn: "",
              categoryId: "cat-beauty",
              basePrice: 5000,
              descAr: "",
              descEn: "",
              image: "/uploads/lipstick.webp",
              isFeatured: true,
              variantNameAr: "درجة 01 قياسي",
              variantNameEn: "01 Standard",
              stockQuantity: 20,
            });
            setImageSourceTab("device");
            setUploadError(null);
            setIsCreateOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-neutral-950 font-bold text-xs shadow-luxury transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isAr ? "إضافة منتج جديد" : "Add New Product"}</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Package className="w-10 h-10 mx-auto text-neutral-400" />
            <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
              {isAr ? "لا توجد منتجات مطابقة" : "No products found"}
            </h4>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/70 text-neutral-500">
                  <th className="py-3 px-4 text-start font-semibold">{isAr ? "المنتج" : "Product"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{isAr ? "الفئة" : "Category"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{isAr ? "السعر الأساسي" : "Base Price"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{isAr ? "المخزون الإجمالي" : "Total Stock"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{isAr ? "مميز؟" : "Featured"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredProducts.map((prod) => {
                  const totalStock = prod.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
                  return (
                    <tr key={prod.id} className="hover:bg-neutral-50/80 dark:hover:bg-neutral-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0 border border-neutral-200/60 dark:border-neutral-700/60">
                            <Image
                              src={prod.images[0] || "/uploads/lipstick.webp"}
                              alt={prod.nameAr}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 dark:text-white block">
                              {isAr ? prod.nameAr : prod.nameEn}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {prod.variants.length} {isAr ? "خيارات / درجات" : "variants"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                          {prod.category
                            ? isAr
                              ? prod.category.nameAr
                              : prod.category.nameEn
                            : "عام"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <CurrencyBadge amount={prod.basePrice} locale={locale} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-neutral-800 dark:text-neutral-200">
                        {totalStock > 0 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">
                            {totalStock} {isAr ? "قطعة" : "pcs"}
                          </span>
                        ) : (
                          <span className="text-red-500">{isAr ? "نفد" : "0"}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {prod.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-600 dark:text-gold-400">
                            <Sparkles className="w-3 h-3" />
                            <span>{isAr ? "نعم" : "Yes"}</span>
                          </span>
                        ) : (
                          <span className="text-neutral-400">{isAr ? "لا" : "No"}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(prod)}
                            className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                            title={isAr ? "تعديل" : "Edit"}
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProductId(prod.id)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                            title={isAr ? "حذف" : "Delete"}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {(isCreateOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-xl rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-gold-500" />
                <span>
                  {editingProduct
                    ? isAr
                      ? "تعديل بيانات المنتج"
                      : "Edit Product Details"
                    : isAr
                      ? "إضافة منتج فاخر جديد"
                      : "Add New Luxury Product"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingProduct ? handleEditSubmit : handleCreateSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isAr ? "اسم المنتج بالعربية" : "Arabic Product Name"} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? "مثال: عطر المسك الأبيض" : "e.g. White Musk Parfum"}
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isAr ? "اسم المنتج بالإنجليزية" : "English Product Name"} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal White Musk"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isAr ? "الفئة" : "Category"} *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
                  >
                    <option value="cat-beauty">{isAr ? "مستحضرات التجميل والعناية" : "Beauty & Cosmetics"}</option>
                    <option value="cat-fashion">{isAr ? "الملابس والأزياء والعبايات" : "Fashion & Apparel"}</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    {isAr ? "السعر الأساسي (ريال يمني)" : "Base Price (YER)"} *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  {isAr ? "الوصف المختصر بالعربية" : "Arabic Description"}
                </label>
                <textarea
                  rows={2}
                  value={formData.descAr}
                  onChange={(e) => setFormData({ ...formData, descAr: e.target.value })}
                  placeholder={isAr ? "تفاصيل وميزات المنتج..." : "Product highlights..."}
                  className="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {/* Image Picker Section with Device Upload & Catalog Presets */}
              <div className="space-y-2.5 p-3 rounded-2xl bg-neutral-100/50 dark:bg-neutral-800/30 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="block font-bold text-neutral-800 dark:text-neutral-200">
                    {isAr ? "صورة المنتج" : "Product Image"} *
                  </label>

                  {/* Toggle Tabs */}
                  <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200/80 dark:border-neutral-800 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setImageSourceTab("device")}
                      className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        imageSourceTab === "device"
                          ? "bg-gold-500 text-neutral-950 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isAr ? "رفع من جهازي (جوال / كمبيوتر)" : "Upload from Device"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageSourceTab("preset")}
                      className={`flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-lg transition-all ${
                        imageSourceTab === "preset"
                          ? "bg-gold-500 text-neutral-950 shadow-xs"
                          : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{isAr ? "المكتبة الجاهزة" : "Catalog Presets"}</span>
                    </button>
                  </div>
                </div>

                {/* TAB 1: DEVICE UPLOAD ZONE */}
                {imageSourceTab === "device" && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <label
                      className={`relative flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                        isUploading
                          ? "border-gold-500 bg-gold-50/20 dark:bg-gold-950/20 opacity-80 cursor-wait"
                          : "border-neutral-300 dark:border-neutral-700 hover:border-gold-500 hover:bg-white dark:hover:bg-neutral-900 bg-white/70 dark:bg-neutral-900/70 shadow-2xs"
                      }`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={isUploading}
                        onChange={handleDeviceFileUpload}
                      />
                      {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-center py-2">
                          <Loader2 className="w-7 h-7 text-gold-500 animate-spin" />
                          <p className="font-bold text-neutral-800 dark:text-neutral-200 text-xs">
                            {isAr ? "جاري رفع وحفظ الصورة من جهازك..." : "Uploading image from your device..."}
                          </p>
                          <span className="text-[10px] text-neutral-400">
                            {isAr ? "لحظات وتصبح جاهزة في المتجر" : "Just a moment"}
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-center py-1">
                          <div className="w-11 h-11 rounded-2xl bg-gold-50 dark:bg-gold-950/60 border border-gold-400/40 text-gold-600 dark:text-gold-400 flex items-center justify-center shadow-xs">
                            <Camera className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-neutral-900 dark:text-white text-xs">
                              {isAr
                                ? "اضغط هنا لاختيار صورة من جهازك (الاستوديو أو الكمبيوتر)"
                                : "Click here to choose a photo from your device"}
                            </p>
                            <p className="text-[11px] text-neutral-400 mt-0.5">
                              {isAr
                                ? "يدعم JPG, PNG, WebP, AVIF حتى 15 ميجابايت"
                                : "Supports JPG, PNG, WebP up to 15MB"}
                            </p>
                          </div>
                        </div>
                      )}
                    </label>

                    {uploadError && (
                      <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 flex items-center gap-2 text-xs">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{uploadError}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: PRESET IMAGES GRID */}
                {imageSourceTab === "preset" && (
                  <div className="space-y-2 animate-in fade-in duration-200">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {PRESET_IMAGES.map((img) => {
                        const active = formData.image === img.url;
                        return (
                          <button
                            key={img.url}
                            type="button"
                            onClick={() => setFormData({ ...formData, image: img.url })}
                            className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                              active
                                ? "border-gold-500 ring-2 ring-gold-500/30 shadow-xs scale-105"
                                : "border-neutral-200 dark:border-neutral-700 opacity-60 hover:opacity-100"
                            }`}
                          >
                            <Image src={img.url} alt={img.labelAr} fill className="object-cover" />
                            {active && (
                              <div className="absolute inset-0 bg-gold-500/20 flex items-center justify-center">
                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* LIVE PREVIEW OF SELECTED IMAGE */}
                {formData.image && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-gold-500/40 shrink-0">
                      <Image src={formData.image} alt="Preview" fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                        <span>
                          {formData.image.startsWith("/uploads/upload-")
                            ? isAr
                              ? "تم الرفع من جهازك بنجاح"
                              : "Uploaded from device"
                            : isAr
                              ? "صورة مختارة من المكتبة الجاهزة"
                              : "Selected from presets"}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5" dir="ltr">
                        {formData.image}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {!editingProduct && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-2xl bg-neutral-100/60 dark:bg-neutral-800/40 border border-neutral-200/50 dark:border-neutral-700/50">
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {isAr ? "الدرجة / المقاس الأول" : "First Variant (Ar)"}
                    </label>
                    <input
                      type="text"
                      value={formData.variantNameAr}
                      onChange={(e) => setFormData({ ...formData, variantNameAr: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {isAr ? "بالإنجليزية" : "First Variant (En)"}
                    </label>
                    <input
                      type="text"
                      value={formData.variantNameEn}
                      onChange={(e) => setFormData({ ...formData, variantNameEn: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      {isAr ? "الكمية بالمخزون" : "Stock Quantity"}
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded text-gold-500 focus:ring-gold-500 cursor-pointer"
                />
                <label htmlFor="isFeatured" className="font-semibold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                  {isAr ? "إظهار في قسم المختارات الفاخرة المميزة (Featured)" : "Display in Featured Luxury Showcase"}
                </label>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-xl bg-gold-600 hover:bg-gold-700 text-white font-bold flex items-center gap-2 shadow-md transition disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>
                    {editingProduct
                      ? isAr
                        ? "حفظ التعديلات"
                        : "Save Changes"
                      : isAr
                        ? "إضافة المنتج الآن"
                        : "Create Product"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-sm rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              {isAr ? "هل أنت متأكد من حذف هذا المنتج؟" : "Confirm Product Deletion?"}
            </h3>
            <p className="text-xs text-neutral-500">
              {isAr
                ? "سيتم حذف المنتج وخياراته من المتجر نهائياً."
                : "This product and its variants will be removed from your store."}
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingProductId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isAr ? "تراجع" : "Cancel"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isAr ? "نعم، احذف المنتج" : "Delete Product"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
