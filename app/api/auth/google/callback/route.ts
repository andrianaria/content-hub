import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateOAuthUser, createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] OAuth callback started")
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    console.log("[v0] OAuth params:", { code: !!code, state })

    if (!code) {
      console.log("[v0] Missing authorization code")
      return NextResponse.redirect(new URL("/login?error=missing_code", request.url))
    }

    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.log("[v0] Missing Google OAuth credentials")
      return NextResponse.redirect(new URL("/login?error=missing_credentials", request.url))
    }

    console.log("[v0] Exchanging code for token...")
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/api/auth/google/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.log("[v0] Token exchange failed:", errorText)
      throw new Error("Failed to exchange code for token")
    }

    const tokens = await tokenResponse.json()
    console.log("[v0] Token exchange successful")

    // Get user info from Google
    console.log("[v0] Fetching user info from Google...")
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    if (!userResponse.ok) {
      console.log("[v0] Failed to get user info from Google")
      throw new Error("Failed to get user info")
    }

    const googleUser = await userResponse.json()
    console.log("[v0] Google user info:", { email: googleUser.email, name: googleUser.name, id: googleUser.id })

    // Create or find user in database
    console.log("[v0] Creating/finding user in database...")
    const user = await findOrCreateOAuthUser(googleUser.email, googleUser.name, "google", googleUser.id)
    console.log("[v0] User created/found:", { id: user.id, email: user.email })

    // Create session
    console.log("[v0] Creating session...")
    await createSession(user)
    console.log("[v0] Session created successfully")

    // Redirect to dashboard
    console.log("[v0] Redirecting to dashboard...")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("[v0] Google OAuth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
