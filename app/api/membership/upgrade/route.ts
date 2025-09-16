import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { updateUserMembership, getMembershipPlanById } from "@/lib/membership"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 })
    }

    const plan = getMembershipPlanById(planId)

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan ID" }, { status: 400 })
    }

    // In a real application, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment

    const updatedUser = await updateUserMembership(session.id, plan.id)

    return NextResponse.json({
      message: "Membership upgraded successfully",
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        membership_type: updatedUser.membership_type,
        membership_expires_at: updatedUser.membership_expires_at,
      },
    })
  } catch (error) {
    console.error("Membership upgrade error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
