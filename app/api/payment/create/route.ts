import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { createPaymentTransaction, PAYMENT_METHODS } from "@/lib/payment"
import { getMembershipPlanById } from "@/lib/membership"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { planId, paymentMethod } = await request.json()

    if (!planId || !paymentMethod) {
      return NextResponse.json({ error: "Plan ID and payment method are required" }, { status: 400 })
    }

    const plan = getMembershipPlanById(planId)
    const paymentMethodData = PAYMENT_METHODS.find((method) => method.id === paymentMethod)

    if (!plan || !paymentMethodData) {
      return NextResponse.json({ error: "Invalid plan ID or payment method" }, { status: 400 })
    }

    const transaction = await createPaymentTransaction(session.id, plan.id, plan.price, paymentMethod)

    return NextResponse.json({
      message: "Payment transaction created successfully",
      transactionId: transaction.id,
      paymentCode: transaction.payment_code,
      expiresAt: transaction.expires_at,
    })
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
