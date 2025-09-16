import { sql } from "./db"

export interface PaymentMethod {
  id: string
  name: string
  type: "bank_transfer" | "e_wallet" | "credit_card"
  icon: string
  description: string
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: "bca",
    name: "Bank BCA",
    type: "bank_transfer",
    icon: "🏦",
    description: "Transfer melalui ATM, Internet Banking, atau Mobile Banking BCA",
  },
  {
    id: "mandiri",
    name: "Bank Mandiri",
    type: "bank_transfer",
    icon: "🏦",
    description: "Transfer melalui ATM, Internet Banking, atau Mobile Banking Mandiri",
  },
  {
    id: "gopay",
    name: "GoPay",
    type: "e_wallet",
    icon: "💳",
    description: "Bayar langsung melalui aplikasi Gojek",
  },
  {
    id: "ovo",
    name: "OVO",
    type: "e_wallet",
    icon: "💳",
    description: "Bayar menggunakan saldo OVO Anda",
  },
  {
    id: "dana",
    name: "DANA",
    type: "e_wallet",
    icon: "💳",
    description: "Bayar menggunakan saldo DANA Anda",
  },
  {
    id: "credit_card",
    name: "Kartu Kredit",
    type: "credit_card",
    icon: "💳",
    description: "Visa, Mastercard, JCB",
  },
]

export interface PaymentTransaction {
  id: string
  user_id: string
  plan_id: string
  amount: number
  payment_method: string
  status: "pending" | "paid" | "failed" | "expired"
  payment_code?: string
  expires_at: Date
  created_at: Date
  updated_at: Date
}

export async function createPaymentTransaction(
  userId: string,
  planId: string,
  amount: number,
  paymentMethod: string,
): Promise<PaymentTransaction> {
  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const paymentCode = generatePaymentCode(paymentMethod)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours to complete payment

  const result = await sql`
    INSERT INTO payment_transactions (
      id, user_id, plan_id, amount, payment_method, status, payment_code, expires_at
    ) VALUES (
      ${transactionId}, ${userId}, ${planId}, ${amount}, ${paymentMethod}, 'pending', ${paymentCode}, ${expiresAt.toISOString()}
    )
    RETURNING *
  `

  return result[0] as PaymentTransaction
}

export async function getPaymentTransaction(transactionId: string): Promise<PaymentTransaction | null> {
  const result = await sql`
    SELECT * FROM payment_transactions WHERE id = ${transactionId}
  `
  return (result[0] as PaymentTransaction) || null
}

export async function updatePaymentStatus(
  transactionId: string,
  status: "paid" | "failed" | "expired",
): Promise<PaymentTransaction> {
  const result = await sql`
    UPDATE payment_transactions 
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${transactionId}
    RETURNING *
  `
  return result[0] as PaymentTransaction
}

function generatePaymentCode(paymentMethod: string): string {
  const prefix = paymentMethod.toUpperCase().substr(0, 3)
  const code = Math.random().toString().substr(2, 10)
  return `${prefix}${code}`
}

export function getPaymentInstructions(paymentMethod: string, paymentCode: string, amount: number) {
  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)

  const instructions: Record<string, string[]> = {
    bca: [
      "1. Login ke BCA Mobile atau Internet Banking",
      "2. Pilih menu Transfer",
      "3. Pilih Transfer ke Rekening BCA",
      `4. Masukkan nomor rekening: ${paymentCode}`,
      `5. Masukkan nominal: ${formattedAmount}`,
      "6. Konfirmasi dan selesaikan pembayaran",
      "7. Simpan bukti transfer",
    ],
    mandiri: [
      "1. Login ke Mandiri Online atau Mobile Banking",
      "2. Pilih menu Transfer",
      "3. Pilih Transfer ke Rekening Mandiri",
      `4. Masukkan nomor rekening: ${paymentCode}`,
      `5. Masukkan nominal: ${formattedAmount}`,
      "6. Konfirmasi dan selesaikan pembayaran",
      "7. Simpan bukti transfer",
    ],
    gopay: [
      "1. Buka aplikasi Gojek",
      "2. Pilih menu GoPay",
      "3. Pilih 'Bayar' atau 'Transfer'",
      `4. Masukkan kode pembayaran: ${paymentCode}`,
      `5. Konfirmasi nominal: ${formattedAmount}`,
      "6. Selesaikan pembayaran dengan PIN GoPay",
    ],
    ovo: [
      "1. Buka aplikasi OVO",
      "2. Pilih menu 'Transfer' atau 'Bayar'",
      `3. Masukkan kode pembayaran: ${paymentCode}`,
      `4. Konfirmasi nominal: ${formattedAmount}`,
      "5. Selesaikan pembayaran dengan PIN OVO",
    ],
    dana: [
      "1. Buka aplikasi DANA",
      "2. Pilih menu 'Bayar' atau 'Transfer'",
      `3. Masukkan kode pembayaran: ${paymentCode}`,
      `4. Konfirmasi nominal: ${formattedAmount}`,
      "5. Selesaikan pembayaran dengan PIN DANA",
    ],
    credit_card: [
      "1. Anda akan diarahkan ke halaman pembayaran",
      "2. Masukkan detail kartu kredit Anda",
      "3. Masukkan CVV dan tanggal expired",
      `4. Konfirmasi pembayaran sebesar ${formattedAmount}`,
      "5. Selesaikan dengan OTP dari bank",
    ],
  }

  return instructions[paymentMethod] || []
}
