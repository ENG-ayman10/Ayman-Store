import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import type { ReviewType } from "@/types";

const DATA_DIR = join(process.cwd(), "data");
const REVIEWS_FILE = join(DATA_DIR, "reviews.json");

async function ensureStorage(): Promise<void> {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
  if (!existsSync(REVIEWS_FILE)) {
    await writeFile(REVIEWS_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export async function readReviewsFromDisk(): Promise<ReviewType[]> {
  try {
    await ensureStorage();
    const data = await readFile(REVIEWS_FILE, "utf-8");
    return JSON.parse(data) as ReviewType[];
  } catch (error) {
    console.warn("Could not read reviews from disk:", error);
    return [];
  }
}

export async function addReviewToDisk(review: ReviewType): Promise<void> {
  try {
    const reviews = await readReviewsFromDisk();
    const filtered = reviews.filter((r) => r.id !== review.id);
    filtered.unshift(review);
    await writeFile(REVIEWS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
  } catch (error) {
    console.warn("Could not write review to disk:", error);
  }
}

export async function updateReviewOnDisk(
  reviewId: string,
  isApproved: boolean
): Promise<boolean> {
  try {
    const reviews = await readReviewsFromDisk();
    const index = reviews.findIndex((r) => r.id === reviewId);
    if (index === -1) return false;

    reviews[index].isApproved = isApproved;
    await writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.warn("Could not update review on disk:", error);
    return false;
  }
}

export async function deleteReviewFromDisk(reviewId: string): Promise<boolean> {
  try {
    const reviews = await readReviewsFromDisk();
    const filtered = reviews.filter((r) => r.id !== reviewId);
    if (filtered.length === reviews.length) return false;

    await writeFile(REVIEWS_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  } catch (error) {
    console.warn("Could not delete review from disk:", error);
    return false;
  }
}
