import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateOAuthUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    const user = await findOrCreateOAuthUser(userData.email, userData.name, "google", userData.sub)

    await createSession(user)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json({ error: "Gagal login dengan Google" }, { status: 500 })
  }
}
