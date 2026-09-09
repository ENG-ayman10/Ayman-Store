import { z } from "zod";

export const CheckoutItemSchema = z.object({
  variantId: z.string().min(1, "Variant is required"),
  quantity: z.number().int().positive("Quantity must be greater than 0"),
});

export const CheckoutSchema = z.object({
  customerName: z.string().min(2, "Customer name is required"),
  phone: z.string().min(7, "Valid phone number is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(3, "Detailed address is required"),
  notes: z.string().optional(),
  locationUrl: z.string().optional(),
  locale: z.enum(["ar", "en"]).default("ar"),
  items: z.array(CheckoutItemSchema).min(1, "At least one item is required in cart"),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;

export const TrackOrderSchema = z.object({
  query: z.string().min(3, "Order code or phone number must be at least 3 characters"),
});

export type TrackOrderInput = z.infer<typeof TrackOrderSchema>;

export const UpdateOrderStatusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum([
    "PENDING_PAYMENT",
    "PAYMENT_CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;
