"use client";

import React, { useState, useEffect, useRef } from "react";
import type { OrderType } from "@/types";
import { getAdminOrders } from "@/actions/orders";
import { Bell, MessageCircle, X } from "lucide-react";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";

interface LiveOrderNotifierProps {
  locale: "ar" | "en";
}

function playLuxuryOrderChime() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const playNote = (freq: number, start: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.25, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    playNote(587.33, now, 0.25); // D5
    playNote(739.99, now + 0.12, 0.25); // F#5
    playNote(880.0, now + 0.24, 0.45); // A5
  } catch {
    // Silently ignore if browser blocked auto-audio
  }
}

export function LiveOrderNotifier({ locale }: LiveOrderNotifierProps) {
  const isAr = locale === "ar";
  const [newOrderAlert, setNewOrderAlert] = useState<OrderType | null>(null);
  const knownOrderCodesRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    let isMounted = true;

    // Request browser notification permission if supported
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().catch(() => {});
      }
    }

    const checkNewOrders = async () => {
      try {
        const latestOrders = await getAdminOrders();
        if (!isMounted) return;

        if (isInitialLoadRef.current) {
          latestOrders.forEach((o) => knownOrderCodesRef.current.add(o.orderCode));
          isInitialLoadRef.current = false;
          return;
        }

        // Check if there are orders not yet in known codes
        for (const order of latestOrders) {
          if (!knownOrderCodesRef.current.has(order.orderCode)) {
            knownOrderCodesRef.current.add(order.orderCode);
            setNewOrderAlert(order);
            playLuxuryOrderChime();

            // Trigger system browser notification if permitted
            if (
              typeof window !== "undefined" &&
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              try {
                new Notification(
                  isAr ? `🛍️ طلب جديد: ${order.orderCode}` : `🛍️ New Order: ${order.orderCode}`,
                  {
                    body: isAr
                      ? `العميل: ${order.customerName} - المبلغ: ${order.totalAmount} ر.ي`
                      : `Customer: ${order.customerName} - Total: ${order.totalAmount} YER`,
                    icon: "/uploads/logo.png",
                  }
                );
              } catch {
                // Ignore notification error
              }
            }
            break;
          }
        }
      } catch {
        // Polling error ignored
      }
    };

    // Run initial fetch
    checkNewOrders();

    // Poll every 5 seconds for live order arrivals
    const interval = setInterval(checkNewOrders, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isAr]);

  if (!newOrderAlert) return null;

  const rawPhone = newOrderAlert.phone.replace(/[^0-9]/g, "");
  const internationalPhone = rawPhone.startsWith("967")
    ? rawPhone
    : `967${rawPhone.startsWith("0") ? rawPhone.slice(1) : rawPhone}`;

  const message = isAr
    ? `مرحباً ${newOrderAlert.customerName}، استلمنا طلبك رقم (${newOrderAlert.orderCode}) في متجر أيمن وجاري مراجعته وتجهيزه.`
    : `Hello ${newOrderAlert.customerName}, we received your order (${newOrderAlert.orderCode}) at Ayman Store.`;

  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:end-6 sm:bottom-6 z-50 sm:max-w-md w-auto animate-in slide-in-from-bottom duration-300">
      <div className="rounded-2xl sm:rounded-3xl border-2 border-gold-500 bg-neutral-900/95 text-white p-4 sm:p-5 shadow-2xl backdrop-blur-2xl space-y-3 ring-4 ring-gold-500/20">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span className="text-xs font-black text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="w-4 h-4 shrink-0 text-gold-400" />
              <span>{isAr ? "🔔 طلب جديد وصل الآن!" : "🔔 New Order Received!"}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setNewOrderAlert(null)}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1.5 text-xs bg-neutral-950/60 p-3 rounded-xl border border-neutral-800">
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono font-black text-sm text-white tracking-wider">
              {newOrderAlert.orderCode}
            </span>
            <CurrencyBadge
              amount={newOrderAlert.totalAmount}
              locale={locale}
              size="md"
              className="text-gold-400 font-black"
            />
          </div>
          <p className="text-neutral-300 truncate">
            {isAr ? "العميل:" : "Customer:"}{" "}
            <strong className="text-white">{newOrderAlert.customerName}</strong>{" "}
            <span className="text-neutral-400">({newOrderAlert.city})</span>
          </p>
          <p className="text-neutral-400 text-[11px]">
            {newOrderAlert.items.length} {isAr ? "أصناف مطلوبة" : "items ordered"}
          </p>
        </div>

        <div className="pt-1 flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setNewOrderAlert(null)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/30 transition active:scale-95"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>{isAr ? "محادثة العميل واتساب" : "Chat on WhatsApp"}</span>
          </a>
          <button
            type="button"
            onClick={() => setNewOrderAlert(null)}
            className="px-3.5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-bold transition active:scale-95 shrink-0"
          >
            {isAr ? "إغلاق" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}
