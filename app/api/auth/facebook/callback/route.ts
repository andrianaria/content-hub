import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateOAuthUser, createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Facebook OAuth callback started")
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")

    console.log("[v0] Facebook OAuth params:", { code: !!code, state })

    if (!code) {
      console.log("[v0] Missing Facebook authorization code")
      return NextResponse.redirect(new URL("/login?error=missing_code", request.url))
    }

    if (!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) {
      console.log("[v0] Missing Facebook OAuth credentials")
      return NextResponse.redirect(new URL("/login?error=missing_credentials", request.url))
    }

    console.log("[v0] Exchanging Facebook code for token...")
    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL || request.nextUrl.origin}/api/auth/facebook/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.log("[v0] Facebook token exchange failed:", errorText)
      throw new Error("Failed to exchange code for token")
    }

    const tokens = await tokenResponse.json()
    console.log("[v0] Facebook token exchange successful")

    // Get user info from Facebook
    console.log("[v0] Fetching user info from Facebook...")
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokens.access_token}`,
    )

    if (!userResponse.ok) {
      console.log("[v0] Failed to get user info from Facebook")
      throw new Error("Failed to get user info")
    }

    const facebookUser = await userResponse.json()
    console.log("[v0] Facebook user info:", { email: facebookUser.email, name: facebookUser.name, id: facebookUser.id })

    // Create or find user in database
    console.log("[v0] Creating/finding user in database...")
    const user = await findOrCreateOAuthUser(facebookUser.email, facebookUser.name, "facebook", facebookUser.id)
    console.log("[v0] User created/found:", { id: user.id, email: user.email })

    // Create session
    console.log("[v0] Creating session...")
    await createSession(user)
    console.log("[v0] Session created successfully")

    // Redirect to dashboard
    console.log("[v0] Redirecting to dashboard...")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  } catch (error) {
    console.error("[v0] Facebook OAuth callback error:", error)
    return NextResponse.redirect(new URL("/login?error=oauth_failed", request.url))
  }
}
