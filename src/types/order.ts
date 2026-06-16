//   src/types/order.ts

export type OrderStatus = 
  | 'pending'      // Ausstehend
  | 'processing'   // In Bearbeitung
  | 'paid'         // Bezahlt
  | 'shipped'      // Versendet
  | 'delivered'    // Geliefert
  | 'cancelled'    // Storniert
  | 'refunded'     // Rückerstattet

export interface OrderStatusConfig {
  value: OrderStatus
  label: string
  color: string
  bgColor: string
  steps: number
}

export const ORDER_STATUSES: OrderStatusConfig[] = [
  { value: 'pending', label: 'Ausstehend', color: 'text-yellow-800', bgColor: 'bg-yellow-100', steps: 1 },
  { value: 'processing', label: 'In Bearbeitung', color: 'text-blue-800', bgColor: 'bg-blue-100', steps: 2 },
  { value: 'paid', label: 'Bezahlt', color: 'text-green-800', bgColor: 'bg-green-100', steps: 3 },
  { value: 'shipped', label: 'Versendet', color: 'text-purple-800', bgColor: 'bg-purple-100', steps: 4 },
  { value: 'delivered', label: 'Geliefert', color: 'text-emerald-800', bgColor: 'bg-emerald-100', steps: 5 },
  { value: 'cancelled', label: 'Storniert', color: 'text-red-800', bgColor: 'bg-red-100', steps: 0 },
  { value: 'refunded', label: 'Rückerstattet', color: 'text-orange-800', bgColor: 'bg-orange-100', steps: 0 },
]

export interface Order {
  id: string
  order_number: string
  user_id: string
  total_amount: number
  status: OrderStatus
  payment_method: string
  payment_status: string
  shipping_address: string
  shipping_city: string
  shipping_zip: string
  shipping_country: string
  tracking_number?: string
  tracking_url?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  price: number
}