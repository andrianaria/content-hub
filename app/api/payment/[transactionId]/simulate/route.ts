import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getPaymentTransaction, updatePaymentStatus } from "@/lib/payment"
import { updateUserMembership } from "@/lib/membership"

interface RouteParams {
  params: Promise<{ transactionId: string }>
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getSession()
    const { transactionId } = await params

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const transaction = await getPaymentTransaction(transactionId)

    if (!transaction || transaction.user_id !== session.id) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    if (transaction.status !== "pending") {
      return NextResponse.json({ error: "Transaction is not pending" }, { status: 400 })
    }

    // Update payment status to paid
    await updatePaymentStatus(transactionId, "paid")

    // Update user membership
    await updateUserMembership(session.id, transaction.plan_id as any)

    return NextResponse.json({
      message: "Payment simulated successfully",
      status: "paid",
    })
  } catch (error) {
    console.error("Payment simulation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
