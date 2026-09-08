import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { ProductType } from "@/types";

interface WishlistStore {
  items: ProductType[];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlist: (product: ProductType) => void;
  isInWishlist: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  getTotalCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      toggleWishlist: (product) => {
        const currentItems = get().items;
        const exists = currentItems.some((p) => p.id === product.id);
        if (exists) {
          set({ items: currentItems.filter((p) => p.id !== product.id) });
        } else {
          set({ items: [product, ...currentItems] });
        }
      },
      isInWishlist: (productId) => {
        return get().items.some((p) => p.id === productId);
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((p) => p.id !== productId) });
      },
      clearWishlist: () => set({ items: [] }),
      getTotalCount: () => {
        return get().items.length;
      },
    }),
    {
      name: "ayman-store-wishlist",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
