"use server";

import prisma from "@/lib/prisma";
import {
  readReviewsFromDisk,
  addReviewToDisk,
  updateReviewOnDisk,
  deleteReviewFromDisk,
} from "@/lib/reviewStorage";
import type { ReviewType } from "@/types";
import { revalidatePath } from "next/cache";
import { isAdminAuthenticated } from "@/actions/auth";

export interface SubmitReviewInput {
  customerName: string;
  rating: number;
  comment: string;
  city?: string;
  orderCode?: string;
  productId?: string;
}

function mapPrismaReview(r: any): ReviewType {
  return {
    id: r.id,
    orderCode: r.orderCode,
    productId: r.productId,
    customerName: r.customerName,
    rating: Number(r.rating) || 5,
    comment: r.comment,
    city: r.city,
    isApproved: r.isApproved,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : r.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export async function submitCustomerReview(input: SubmitReviewInput): Promise<{
  success: boolean;
  review?: ReviewType;
  error?: string;
}> {
  const customerName = input.customerName?.trim();
  const comment = input.comment?.trim();
  const rating = Math.max(1, Math.min(5, Math.round(Number(input.rating) || 5)));

  if (!customerName) {
    return { success: false, error: "يرجى كتابة الاسم للمتابعة" };
  }
  if (!comment || comment.length < 3) {
    return { success: false, error: "يرجى كتابة تعليق لا يقل عن 3 أحرف" };
  }

  const reviewRecord: ReviewType = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    orderCode: input.orderCode?.trim() || null,
    productId: input.productId?.trim() || null,
    customerName,
    rating,
    comment,
    city: input.city?.trim() || null,
    isApproved: true, // Default to approved so real customer feedback shows up immediately
    createdAt: new Date().toISOString(),
  };

  // 1. Save to Prisma PostgreSQL
  try {
    const created = await prisma.review.create({
      data: {
        orderCode: reviewRecord.orderCode,
        productId: reviewRecord.productId,
        customerName: reviewRecord.customerName,
        rating: reviewRecord.rating,
        comment: reviewRecord.comment,
        city: reviewRecord.city,
        isApproved: true,
      },
    });

    if (created) {
      reviewRecord.id = created.id;
    }
  } catch (dbErr) {
    console.warn("Prisma review create fallback:", dbErr);
  }

  // 2. Also save to disk storage fallback
  try {
    await addReviewToDisk(reviewRecord);
  } catch (diskErr) {
    console.warn("Disk review add error:", diskErr);
  }

  // Revalidate relevant pages
  try {
    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/admin/reviews", "page");
    if (input.productId) {
      revalidatePath("/[locale]/products/[slug]", "page");
    }
  } catch (err) {
    // Revalidation error in action context
  }

  return { success: true, review: reviewRecord };
}

export async function getStoreReviews(limit: number = 8): Promise<ReviewType[]> {
  // 1. Try Prisma
  try {
    const dbReviews = await prisma.review.findMany({
      where: { isApproved: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    if (dbReviews && dbReviews.length > 0) {
      return dbReviews.map(mapPrismaReview);
    }
  } catch (err) {
    console.warn("Prisma getStoreReviews fallback:", err);
  }

  // 2. Disk fallback
  const disk = await readReviewsFromDisk();
  return disk
    .filter((r) => r.isApproved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getProductReviews(productId: string): Promise<ReviewType[]> {
  if (!productId) return [];

  // 1. Try Prisma
  try {
    const dbReviews = await prisma.review.findMany({
      where: { productId, isApproved: true },
      orderBy: { createdAt: "desc" },
    });

    if (dbReviews && dbReviews.length > 0) {
      return dbReviews.map(mapPrismaReview);
    }
  } catch (err) {
    console.warn("Prisma getProductReviews fallback:", err);
  }

  // 2. Disk fallback
  const disk = await readReviewsFromDisk();
  return disk
    .filter((r) => r.productId === productId && r.isApproved)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAdminReviews(): Promise<ReviewType[]> {
  // 1. Try Prisma
  try {
    const dbReviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
    });

    if (dbReviews && dbReviews.length > 0) {
      return dbReviews.map(mapPrismaReview);
    }
  } catch (err) {
    console.warn("Prisma getAdminReviews fallback:", err);
  }

  // 2. Disk fallback
  const disk = await readReviewsFromDisk();
  return disk.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function toggleReviewStatus(
  reviewId: string,
  isApproved: boolean
): Promise<{ success: boolean; isApproved?: boolean; error?: string }> {
  try {
    let updated = false;

    // Prisma
    try {
      await prisma.review.update({
        where: { id: reviewId },
        data: { isApproved },
      });
      updated = true;
    } catch (e) {
      console.warn("Prisma update review fallback:", e);
    }

    // Disk
    try {
      const diskUpdated = await updateReviewOnDisk(reviewId, isApproved);
      if (diskUpdated) updated = true;
    } catch {}

    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/admin/reviews", "page");

    return { success: updated, isApproved };
  } catch (error) {
    console.error("Failed to toggle review status:", error);
    return { success: false, error: "تعذر تحديث حالة التقييم" };
  }
}

export async function deleteReview(
  reviewId: string
): Promise<{ success: boolean; error?: string }> {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth && process.env.NODE_ENV === "production") {
    return { success: false, error: "غير مصرح لك بحذف التقييمات" };
  }

  try {
    let deleted = false;

    // Prisma
    try {
      await prisma.review.delete({
        where: { id: reviewId },
      });
      deleted = true;
    } catch (e) {
      console.warn("Prisma delete review fallback:", e);
    }

    // Disk
    try {
      const diskDeleted = await deleteReviewFromDisk(reviewId);
      if (diskDeleted) deleted = true;
    } catch {}

    revalidatePath("/[locale]", "page");
    revalidatePath("/[locale]/admin/reviews", "page");

    return { success: deleted };
  } catch (error) {
    console.error("Failed to delete review:", error);
    return { success: false, error: "تعذر حذف التقييم" };
  }
}
