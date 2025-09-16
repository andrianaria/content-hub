"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function TestFacebookOAuthPage() {
  const [testResults, setTestResults] = useState<any>(null)

  const runTests = () => {
    const results = {
      facebookAppId: !!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
      facebookAppIdValue: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
        ? process.env.NEXT_PUBLIC_FACEBOOK_APP_ID.substring(0, 15) + "..."
        : "Not set",
      currentOrigin: typeof window !== "undefined" ? window.location.origin : "Unknown",
      callbackUrl: typeof window !== "undefined" ? `${window.location.origin}/api/auth/facebook/callback` : "Unknown",
      facebookAuthUrl: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID
        ? `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(typeof window !== "undefined" ? `${window.location.origin}/api/auth/facebook/callback` : "")}&scope=email,public_profile`
        : "Cannot generate - App ID missing",
    }

    setTestResults(results)
    console.log("[v0] Facebook OAuth Test Results:", results)
  }

  const testFacebookLogin = () => {
    if (!process.env.NEXT_PUBLIC_FACEBOOK_APP_ID) {
      alert("Facebook App ID not configured!")
      return
    }

    const callbackUrl = `${window.location.origin}/api/auth/facebook/callback`
    const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.NEXT_PUBLIC_FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=email,public_profile&response_type=code`

    console.log("[v0] Redirecting to Facebook OAuth:", facebookAuthUrl)
    window.location.href = facebookAuthUrl
  }

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Facebook OAuth Configuration Test</CardTitle>
          <CardDescription>Test your Facebook OAuth setup to identify configuration issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runTests} className="flex-1">
              Run Configuration Tests
            </Button>
            <Button onClick={testFacebookLogin} variant="outline" className="flex-1 bg-transparent">
              Test Facebook Login
            </Button>
          </div>

          {testResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Facebook App ID Set</span>
                <StatusIcon status={testResults.facebookAppId} />
              </div>

              <div className="p-3 border rounded">
                <div className="font-medium">App ID Value:</div>
                <div className="text-sm text-muted-foreground font-mono">{testResults.facebookAppIdValue}</div>
              </div>

              <div className="p-3 border rounded">
                <div className="font-medium">Current Origin:</div>
                <div className="text-sm text-muted-foreground font-mono">{testResults.currentOrigin}</div>
              </div>

              <div className="p-3 border rounded">
                <div className="font-medium">Callback URL:</div>
                <div className="text-sm text-muted-foreground font-mono">{testResults.callbackUrl}</div>
              </div>

              <div className="p-3 border rounded">
                <div className="font-medium">Facebook Auth URL:</div>
                <div className="text-sm text-muted-foreground font-mono break-all">{testResults.facebookAuthUrl}</div>
              </div>

              {!testResults.facebookAppId && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Missing Facebook App ID!</strong>
                    <br />
                    Add NEXT_PUBLIC_FACEBOOK_APP_ID to your environment variables.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Facebook App Setup Required:</strong>
                  <br />
                  1. Go to Facebook Developers Console
                  <br />
                  2. Create a Facebook App with Facebook Login product
                  <br />
                  3. Add this callback URL: <code>{testResults.callbackUrl}</code>
                  <br />
                  4. Add your domain to Valid OAuth Redirect URIs
                  <br />
                  5. Set App Domain to your domain
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
