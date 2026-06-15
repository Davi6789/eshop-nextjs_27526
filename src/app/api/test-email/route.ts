// src/app/api/test-email/route.ts
 
import { sendOrderConfirmationEmail } from '@/lib/email/send-email'
import { NextResponse } from 'next/server'

export async function GET() {
  // Test-Daten
  const testOrder = {
    id: 'test-123',
    order_number: 'TEST-20241214-001',
    created_at: new Date().toISOString(),
    total_amount: 99.99,
    payment_method: 'paypal',
    status: 'paid',
    shipping_address: 'Teststraße 1, 12345 Berlin'
  }

  const testItems = [
    {
      product_name: 'Test Produkt',
      quantity: 2,
      price: 49.995
    }
  ]

  const testCustomer = {
    name: 'Test User',
    email: 'deine-email@example.com' // Deine Email zum Testen!
  }

  const result = await sendOrderConfirmationEmail({
    order: testOrder,
    orderItems: testItems,
    customer: testCustomer
  })

  return NextResponse.json(result)
}