export type CategoryType = "BEAUTY" | "CLOTHING";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAYMENT_CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface VariantAttributes {
  shadeAr?: string;
  shadeEn?: string;
  colorAr?: string;
  colorEn?: string;
  colorCode?: string;
  size?: string;
  [key: string]: string | undefined;
}

export interface ProductVariantType {
  id: string;
  productId: string;
  sku: string;
  attributes: VariantAttributes;
  priceOverride: number | null;
  stockQuantity: number;
}

export interface ProductType {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descAr: string;
  descEn: string;
  basePrice: number;
  categoryId: string;
  category?: {
    id: string;
    nameAr: string;
    nameEn: string;
    slug: string;
    type: CategoryType;
  };
  images: string[];
  isFeatured: boolean;
  variants: ProductVariantType[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CategoryWithProducts {
  id: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  type: CategoryType;
  products: ProductType[];
}

export interface OrderItemType {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  nameAr: string;
  nameEn: string;
  variantAr: string;
  variantEn: string;
  unitPrice: number;
  quantity: number;
  itemTotal: number;
}

export interface OrderType {
  id: string;
  orderCode: string;
  locale: string;
  customerName: string;
  phone: string;
  city: string;
  address: string;
  notes: string | null;
  locationUrl?: string | null;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  status: OrderStatus;
  receiptUrl: string | null;
  items: OrderItemType[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  nameAr: string;
  nameEn: string;
  variantAr: string;
  variantEn: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
}
