"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { isAdminAuthenticated } from "@/actions/auth";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const isAuth = await isAdminAuthenticated();
    if (!isAuth && process.env.NODE_ENV === "production") {
      return { success: false, error: "غير مصرح لك برفع الصور. يرجى تسجيل الدخول كمسؤول." };
    }

    const file = formData.get("file") as File | null;
    if (!file || file.size === 0) {
      return { success: false, error: "لم يتم اختيار أي ملف صورة" };
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return { success: false, error: "حجم الصورة كبير جداً، الحد الأقصى المسموح به هو 15 ميجابايت" };
    }

    // Validate image mime type or extension
    const validExtensions = ["jpg", "jpeg", "png", "webp", "gif", "avif"];
    const originalName = file.name || "image.webp";
    const ext = originalName.split(".").pop()?.toLowerCase() || "webp";

    if (!file.type.startsWith("image/") && !validExtensions.includes(ext)) {
      return { success: false, error: "يجب اختيار ملف صورة صالح (JPG, PNG, WebP, AVIF)" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeExt = validExtensions.includes(ext) ? ext : "webp";
    const filename = `upload-${Date.now()}-${Math.floor(Math.random() * 100000)}.${safeExt}`;

    const uploadDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), buffer);

    const publicUrl = `/uploads/${filename}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error("Image upload server error:", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء حفظ الصورة على السيرفر" };
  }
}
