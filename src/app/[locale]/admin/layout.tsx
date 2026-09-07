import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { LiveOrderNotifier } from "@/components/admin/LiveOrderNotifier";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-neutral-100/60 dark:bg-neutral-950">
      <AdminSidebar locale={locale as "ar" | "en"} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">{children}</div>
      </div>
      <LiveOrderNotifier locale={locale as "ar" | "en"} />
    </div>
  );
}
