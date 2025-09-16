import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateOAuthUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { id, name, email } = await request.json()

    const user = await findOrCreateOAuthUser(email, name, "facebook", id)

    await createSession(user)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Facebook auth error:", error)
    return NextResponse.json({ error: "Gagal login dengan Facebook" }, { status: 500 })
  }
}
