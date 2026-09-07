import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (newItem) => {
        const currentItems = get().items;
        const existing = currentItems.find((i) => i.variantId === newItem.variantId);
        if (existing) {
          const updatedQuantity = Math.min(
            existing.quantity + newItem.quantity,
            newItem.maxStock || 99
          );
          set({
            items: currentItems.map((i) =>
              i.variantId === newItem.variantId ? { ...i, quantity: updatedQuantity } : i
            ),
            isOpen: true,
          });
        } else {
          set({ items: [...currentItems, newItem], isOpen: true });
        }
      },
      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.variantId === variantId
              ? { ...item, quantity: Math.min(quantity, item.maxStock || 99) }
              : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getTotalCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "ayman-store-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
