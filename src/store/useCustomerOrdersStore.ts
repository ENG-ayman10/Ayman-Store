import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCartStore } from "./useCartStore";
import type { OrderType } from "@/types";

interface CustomerOrdersState {
  savedOrderCodes: string[];
  isOpen: boolean;
  openOrders: () => void;
  closeOrders: () => void;
  addOrderCode: (code: string) => void;
  removeOrderCode: (code: string) => void;
  clearAllOrders: () => void;
  reorder: (order: OrderType, onNavigateToCheckout?: () => void) => void;
}

export const useCustomerOrdersStore = create<CustomerOrdersState>()(
  persist(
    (set, get) => ({
      savedOrderCodes: [],
      isOpen: false,
      openOrders: () => set({ isOpen: true }),
      closeOrders: () => set({ isOpen: false }),
      addOrderCode: (code: string) => {
        const trimmed = code.trim().toUpperCase();
        if (!trimmed) return;
        const current = get().savedOrderCodes;
        if (!current.includes(trimmed)) {
          set({ savedOrderCodes: [trimmed, ...current] });
        }
      },
      removeOrderCode: (code: string) => {
        const trimmed = code.trim().toUpperCase();
        set({
          savedOrderCodes: get().savedOrderCodes.filter((c) => c !== trimmed),
        });
      },
      clearAllOrders: () => set({ savedOrderCodes: [] }),
      reorder: (order: OrderType, onNavigateToCheckout?: () => void) => {
        // 1. Populate cart with items from the past order
        const cartStore = useCartStore.getState();
        cartStore.clearCart();

        if (order.items && order.items.length > 0) {
          for (const item of order.items) {
            cartStore.addItem({
              id: `${item.productId}-${item.variantId || "default"}`,
              productId: item.productId,
              variantId: item.variantId || item.productId,
              nameAr: item.nameAr,
              nameEn: item.nameEn,
              variantAr: item.variantAr || "قياسي",
              variantEn: item.variantEn || "Standard",
              price: item.unitPrice,
              image: (item as any).image || "/uploads/lipstick.webp",
              quantity: item.quantity,
              maxStock: 99,
            });
          }
        }

        // 2. Extract clean address and GPS map URL
        const mapRegex = /\[📍 موقع الخريطة:\s*(https?:\/\/[^\s\]]+)\]/;
        const match = order.address?.match(mapRegex);
        const cleanAddress = order.address
          ? order.address.replace(mapRegex, "").trim()
          : "";
        const locationUrl = order.locationUrl || (match ? match[1] : null);

        // 3. Save prefill details in localStorage for checkout form
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              "ayman-store-reorder-prefill",
              JSON.stringify({
                customerName: order.customerName,
                phone: order.phone,
                city: order.city,
                address: cleanAddress,
                notes: order.notes || "",
                locationUrl: locationUrl,
                fromOrderCode: order.orderCode,
                timestamp: Date.now(),
              })
            );
          } catch (e) {
            console.error("Failed to save reorder prefill", e);
          }
        }

        // 4. Close orders drawer and redirect
        set({ isOpen: false });
        if (onNavigateToCheckout) {
          onNavigateToCheckout();
        }
      },
    }),
    {
      name: "ayman-store-customer-orders",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ savedOrderCodes: state.savedOrderCodes }),
    }
  )
);
