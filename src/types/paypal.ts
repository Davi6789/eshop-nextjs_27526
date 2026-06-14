// src/types/paypal.ts 

export interface PayPalOrder {
  id: string
  status: 'CREATED' | 'SAVED' | 'APPROVED' | 'VOIDED' | 'COMPLETED' | 'PAYER_ACTION_REQUIRED'
  intent: 'CAPTURE' | 'AUTHORIZE'
  purchase_units: {
    amount: {
      currency_code: string
      value: string
    }
  }[]
  payer?: {
    email_address: string
    payer_id: string
    name: {
      given_name: string
      surname: string
    }
  }
}

export interface PayPalCaptureResponse {
  id: string
  status: 'COMPLETED' | 'DECLINED' | 'PARTIALLY_REFUNDED' | 'PENDING'
  purchase_units: {
    payments: {
      captures: {
        id: string
        status: string
        amount: {
          currency_code: string
          value: string
        }
      }[]
    }
  }[]
}