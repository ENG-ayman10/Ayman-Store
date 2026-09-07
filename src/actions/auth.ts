"use server";

import { cookies } from "next/headers";
import { createAdminToken, verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

const EXPECTED_USERNAME = process.env.ADMIN_USERNAME || "admin";
const EXPECTED_PASSWORD = process.env.ADMIN_PASSWORD || "ayman_admin_2026";

export async function loginAdmin(prevState: unknown, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "يرجى إدخال اسم المستخدم وكلمة المرور" };
  }

  // Constant-time like comparison or strict check
  if (username.trim() !== EXPECTED_USERNAME || password !== EXPECTED_PASSWORD) {
    return { success: false, error: "اسم المستخدم أو كلمة المرور غير صحيحة" };
  }

  try {
    const token = await createAdminToken(username);
    const cookieStore = await cookies();

    // In local Wi-Fi / IP access (http://192.168.x.x), secure must be false so mobile browsers accept the cookie.
    const isHttps = process.env.FORCE_HTTPS === "true";

    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login session error:", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء تسجيل الدخول" };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    return await verifyAdminToken(token);
  } catch {
    return false;
  }
}
