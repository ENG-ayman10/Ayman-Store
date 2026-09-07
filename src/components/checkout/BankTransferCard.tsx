"use client";

import React, { useState } from "react";
import { Check, Copy, Building2, Wallet } from "lucide-react";
import { STORE_CONFIG } from "@/config/payment";

export function BankTransferCard({ locale }: { locale: "ar" | "en" }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const isAr = locale === "ar";

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/50 p-5 backdrop-blur-sm shadow-xs">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
          {isAr ? "حسابات الدفع والتحويل المالي المعتمدة" : "Approved Transfer Accounts"}
        </h3>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 leading-relaxed">
        {isAr
          ? "انسخ رقم الحساب المناسب وأتمم التحويل، ثم اضغط زر التأكيد لإرسال سند التحويل عبر الواتساب."
          : "Copy the account number, complete your transfer, then submit below to attach your receipt on WhatsApp."}
      </p>

      <div className="grid gap-3">
        {STORE_CONFIG.accounts.map((acc) => {
          const isCopied = copiedId === acc.id;
          return (
            <div
              key={acc.id}
              className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                  {acc.type === "bank" ? (
                    <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <Wallet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {isAr ? acc.nameAr : acc.nameEn}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      ({isAr ? acc.beneficiaryAr : acc.beneficiaryEn})
                    </span>
                  </div>
                  <div className="font-mono font-bold tracking-wider text-sm text-neutral-900 dark:text-neutral-100 mt-0.5">
                    {acc.accountNumber}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => copyToClipboard(acc.id, acc.accountNumber)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-2xs ${
                  isCopied
                    ? "bg-emerald-600 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAr ? "تم النسخ" : "Copied"}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isAr ? "نسخ" : "Copy"}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
