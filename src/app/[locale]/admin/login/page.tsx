import React from "react";
import { AdminLoginClient } from "./AdminLoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "تسجيل دخول الإدارة | متجر أيمن",
  description: "تسجيل الدخول الآمن للوحة إدارة متجر أيمن لمتابعة الطلبات وتحديث الشحنات.",
};

interface LoginPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminLoginPage({ params }: LoginPageProps) {
  const { locale } = await params;
  return <AdminLoginClient locale={locale as "ar" | "en"} />;
}
