"use client";

import React, { useState, useEffect, useRef } from "react";
import type { OrderType } from "@/types";
import { getAdminOrders } from "@/actions/orders";
import { Bell, MessageCircle, X, ExternalLink, Sparkles } from "lucide-react";
import { CurrencyBadge } from "@/components/common/CurrencyBadge";

interface LiveOrderNotifierProps {
  locale: "ar" | "en";
}

function playLuxuryOrderChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

    playNote(587.33, now, 0.25);        // D5
    playNote(739.99, now + 0.12, 0.25); // F#5
    playNote(880.00, now + 0.24, 0.45); // A5
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
  }, []);

  if (!newOrderAlert) return null;

  const rawPhone = newOrderAlert.phone.replace(/[^0-9]/g, "");
  const internationalPhone = rawPhone.startsWith("967")
    ? rawPhone
    : `967${rawPhone.startsWith("0") ? rawPhone.slice(1) : rawPhone}`;

  const message = isAr
    ? `مرحباً ${newOrderAlert.customerName}، استلمنا طلبك رقم (${newOrderAlert.orderCode}) في متجر أيمن وجاري التحقق من إشعار التحويل.`
    : `Hello ${newOrderAlert.customerName}, we received your order (${newOrderAlert.orderCode}) at Ayman Store.`;

  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 end-6 z-50 max-w-md w-full animate-in slide-in-from-bottom duration-300">
      <div className="rounded-3xl border-2 border-gold-500 bg-neutral-900 text-white p-5 shadow-2xl backdrop-blur-xl space-y-3 ring-4 ring-gold-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-black text-gold-400 uppercase tracking-wider flex items-center gap-1">
              <Bell className="w-3.5 h-3.5" />
              <span>{isAr ? "🔔 طلب جديد وصل الآن!" : "🔔 New Order Received!"}</span>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setNewOrderAlert(null)}
            className="p-1 rounded-lg text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-sm text-white">
              {newOrderAlert.orderCode}
            </span>
            <CurrencyBadge
              amount={newOrderAlert.totalAmount}
              locale={locale}
              size="md"
              className="text-gold-400"
            />
          </div>
          <p className="text-neutral-300">
            {isAr ? "العميل:" : "Customer:"} <strong className="text-white">{newOrderAlert.customerName}</strong> ({newOrderAlert.city})
          </p>
          <p className="text-neutral-400 text-[11px]">
            {newOrderAlert.items.length} {isAr ? "أصناف مطلوبة" : "items ordered"}
          </p>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setNewOrderAlert(null)}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{isAr ? "محادثة العميل عبر واتساب" : "Chat on WhatsApp"}</span>
          </a>
          <button
            type="button"
            onClick={() => setNewOrderAlert(null)}
            className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
          >
            {isAr ? "إغلاق" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}
