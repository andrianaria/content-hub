"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Crown, CheckCircle } from "lucide-react"
import type { MembershipPlan } from "@/lib/membership"
import type { SessionUser } from "@/lib/auth"

interface UpgradeFormProps {
  plan: MembershipPlan
  user: SessionUser
}

export function UpgradeForm({ plan, user }: UpgradeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleUpgrade = async () => {
    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/membership/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Gagal upgrade membership")
      }

      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold">Upgrade Berhasil!</h3>
              <p className="text-muted-foreground">Selamat! Membership Anda telah diupgrade ke {plan.name}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">
                Anda sekarang memiliki akses ke {plan.articleLimit === -1 ? "unlimited" : plan.articleLimit} artikel dan{" "}
                {plan.videoLimit === -1 ? "unlimited" : plan.videoLimit} video
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Crown className="h-5 w-5 mr-2 text-yellow-500" />
          Upgrade ke {plan.name}
        </CardTitle>
        <CardDescription>Nikmati akses premium dengan fitur lengkap</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
          <h4 className="font-semibold text-lg mb-3">Yang Anda Dapatkan:</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">
                Akses {plan.articleLimit === -1 ? "unlimited" : `hingga ${plan.articleLimit}`} artikel premium
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">
                Akses {plan.videoLimit === -1 ? "unlimited" : `hingga ${plan.videoLimit}`} video eksklusif
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Konten berkualitas tinggi</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm">Update konten terbaru</span>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Pembayaran:</span>
            <span className="text-2xl font-bold text-primary">Rp {plan.price.toLocaleString("id-ID")}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">Berlaku selama 30 hari</p>
        </div>

        <Button onClick={handleUpgrade} disabled={isLoading} className="w-full" size="lg">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Memproses..." : `Upgrade Sekarang`}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          * Ini adalah demo upgrade. Dalam versi production, akan terintegrasi dengan payment gateway.
        </p>
      </CardContent>
    </Card>
  )
}
