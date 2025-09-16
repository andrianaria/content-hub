"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function OAuthButtons() {
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setIsLoading("google")
    setError("")

    try {
      const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      console.log("[v0] Google Client ID exists:", !!googleClientId)
      console.log("[v0] Current origin:", window.location.origin)

      if (!googleClientId) {
        throw new Error("Google Client ID tidak dikonfigurasi. Pastikan NEXT_PUBLIC_GOOGLE_CLIENT_ID sudah diset.")
      }

      const redirectUri = `${window.location.origin}/api/auth/google/callback`
      const scope = "openid email profile"
      const responseType = "code"
      const state = Math.random().toString(36).substring(2, 15)

      console.log("[v0] Redirect URI:", redirectUri)
      console.log("[v0] OAuth State:", state)

      // Store state in sessionStorage for verification
      sessionStorage.setItem("oauth_state", state)

      const googleAuthUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${googleClientId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=${responseType}&` +
        `state=${state}`

      console.log("[v0] Google Auth URL:", googleAuthUrl)

      // Redirect to Google OAuth
      window.location.href = googleAuthUrl
    } catch (err) {
      console.error("[v0] Google OAuth Error:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login dengan Google")
      setIsLoading(null)
    }
  }

  const handleFacebookLogin = async () => {
    setIsLoading("facebook")
    setError("")

    try {
      const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
      console.log("[v0] Facebook App ID exists:", !!facebookAppId)
      console.log("[v0] Current origin:", window.location.origin)

      if (!facebookAppId) {
        throw new Error("Facebook App ID tidak dikonfigurasi. Pastikan NEXT_PUBLIC_FACEBOOK_APP_ID sudah diset.")
      }

      const redirectUri = `${window.location.origin}/api/auth/facebook/callback`
      const scope = "email,public_profile"
      const responseType = "code"
      const state = Math.random().toString(36).substring(2, 15)

      console.log("[v0] Facebook Redirect URI:", redirectUri)
      console.log("[v0] Facebook OAuth State:", state)

      // Store state in sessionStorage for verification
      sessionStorage.setItem("facebook_oauth_state", state)

      const facebookAuthUrl =
        `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${facebookAppId}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `response_type=${responseType}&` +
        `state=${state}`

      console.log("[v0] Facebook Auth URL:", facebookAuthUrl)

      // Redirect to Facebook OAuth
      window.location.href = facebookAuthUrl
    } catch (err) {
      console.error("[v0] Facebook OAuth Error:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login dengan Facebook")
      setIsLoading(null)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isLoading !== null}
        className="w-full bg-transparent"
      >
        {isLoading === "google" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Masuk dengan Google
      </Button>

      <Button
        variant="outline"
        onClick={handleFacebookLogin}
        disabled={isLoading !== null}
        className="w-full bg-transparent"
      >
        {isLoading === "facebook" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        <svg className="mr-2 h-4 w-4" fill="#1877F2" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Masuk dengan Facebook
      </Button>
    </div>
  )
}
