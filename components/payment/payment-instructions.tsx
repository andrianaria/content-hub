"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Copy, Clock, CheckCircle } from "lucide-react"
import type { PaymentTransaction, PaymentMethod } from "@/lib/payment"
import type { MembershipPlan } from "@/lib/membership"

interface PaymentInstructionsProps {
  transaction: PaymentTransaction
  paymentMethod: PaymentMethod
  instructions: string[]
  plan: MembershipPlan
}

export function PaymentInstructions({ transaction, paymentMethod, instructions, plan }: PaymentInstructionsProps) {
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const expiry = new Date(transaction.expires_at).getTime()
      const difference = expiry - now

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
        )
      } else {
        setTimeLeft("Expired")
      }
    }

    updateTimer()
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [transaction.expires_at])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formattedAmount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(transaction.amount)

  if (transaction.status === "paid") {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center text-green-700">
            <CheckCircle className="h-5 w-5 mr-2" />
            Pembayaran Berhasil
          </CardTitle>
          <CardDescription>Membership Anda telah aktif!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-green-700">
            Terima kasih! Pembayaran untuk {plan.name} telah berhasil diproses. Anda sekarang dapat mengakses semua
            fitur premium.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Payment Timer */}
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          <strong>Selesaikan pembayaran dalam: {timeLeft}</strong>
          <br />
          Transaksi akan otomatis dibatalkan jika tidak diselesaikan dalam waktu yang ditentukan.
        </AlertDescription>
      </Alert>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Pembayaran</CardTitle>
          <CardDescription>Informasi pembayaran untuk {plan.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Metode Pembayaran</span>
              <div className="flex items-center mt-1">
                <span className="mr-2">{paymentMethod.icon}</span>
                <span className="font-medium">{paymentMethod.name}</span>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Total Pembayaran</span>
              <p className="font-bold text-lg">{formattedAmount}</p>
            </div>
          </div>

          {transaction.payment_code && (
            <div>
              <span className="text-sm text-muted-foreground">Kode Pembayaran</span>
              <div className="flex items-center mt-1 p-3 bg-muted rounded-lg">
                <code className="flex-1 font-mono text-lg">{transaction.payment_code}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(transaction.payment_code || "")}
                  className="ml-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Pembayaran</CardTitle>
          <CardDescription>{paymentMethod.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <Badge
                  variant="outline"
                  className="mr-3 mt-0.5 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {index + 1}
                </Badge>
                <span className="text-sm">{instruction}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Simulate Payment Button (for demo purposes) */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-sm">Demo Mode</CardTitle>
          <CardDescription>Dalam mode demo, Anda dapat mensimulasikan pembayaran berhasil</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              // Simulate payment success
              fetch(`/api/payment/${transaction.id}/simulate`, { method: "POST" }).then(() => {
                window.location.reload()
              })
            }}
            variant="outline"
            className="w-full"
          >
            Simulasi Pembayaran Berhasil
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
