"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

export default function TestOAuthPage() {
  const [testResults, setTestResults] = useState<any>(null)

  const runTests = () => {
    const results = {
      googleClientId: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      googleClientIdValue: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
        ? process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.substring(0, 20) + "..."
        : "Not set",
      currentOrigin: typeof window !== "undefined" ? window.location.origin : "Unknown",
      callbackUrl: typeof window !== "undefined" ? `${window.location.origin}/api/auth/google/callback` : "Unknown",
    }

    setTestResults(results)
    console.log("[v0] OAuth Test Results:", results)
  }

  const StatusIcon = ({ status }: { status: boolean }) => {
    return status ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Google OAuth Configuration Test</CardTitle>
          <CardDescription>Test your Google OAuth setup to identify configuration issues</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runTests} className="w-full">
            Run OAuth Tests
          </Button>

          {testResults && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded">
                <span>Google Client ID Set</span>
                <StatusIcon status={testResults.googleClientId} />
              </div>

              <div className="p-3 border rounded">
                <div className="font-medium">Client ID Value:</div>
                <div className="text-sm text-muted-foreground font-mono">{testResults.googleClientIdValue}</div>
              </div>

              <div className="p-3 border rounded">
                <div className="font-medium">Current Origin:</div>
                <div className="text-sm text-muted-foreground font-mono">{testResults.currentOrigin}</div>
              </div>

              <div className="p-3 border rounded">
                <div className="font-medium">Callback URL:</div>
                <div className="text-sm text-muted-foreground font-mono">{testResults.callbackUrl}</div>
              </div>

              {!testResults.googleClientId && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Missing Google Client ID!</strong>
                    <br />
                    Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your environment variables.
                  </AlertDescription>
                </Alert>
              )}

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Google Console Setup Required:</strong>
                  <br />
                  1. Go to Google Cloud Console
                  <br />
                  2. Create OAuth 2.0 credentials
                  <br />
                  3. Add this callback URL: <code>{testResults.callbackUrl}</code>
                  <br />
                  4. Add your domain to authorized origins
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
