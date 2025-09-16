import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import type { PaymentTransaction } from "@/lib/payment"
import type { MembershipPlan } from "@/lib/membership"

interface PaymentStatusProps {
  transaction: PaymentTransaction
  plan: MembershipPlan
}

export function PaymentStatus({ transaction, plan }: PaymentStatusProps) {
  const statusConfig = {
    pending: {
      icon: Clock,
      label: "Menunggu Pembayaran",
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      description: "Silakan selesaikan pembayaran sesuai instruksi di bawah",
    },
    paid: {
      icon: CheckCircle,
      label: "Pembayaran Berhasil",
      color: "bg-green-100 text-green-800 border-green-200",
      description: "Membership Anda telah aktif",
    },
    failed: {
      icon: XCircle,
      label: "Pembayaran Gagal",
      color: "bg-red-100 text-red-800 border-red-200",
      description: "Terjadi kesalahan dalam proses pembayaran",
    },
    expired: {
      icon: AlertCircle,
      label: "Pembayaran Kedaluwarsa",
      color: "bg-gray-100 text-gray-800 border-gray-200",
      description: "Waktu pembayaran telah habis",
    },
  }

  const config = statusConfig[transaction.status]
  const StatusIcon = config.icon

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <StatusIcon className="h-5 w-5 mr-2" />
              Status Pembayaran
            </CardTitle>
            <CardDescription>Transaksi ID: {transaction.id}</CardDescription>
          </div>
          <Badge className={config.color}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Paket:</span>
            <span className="font-medium">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-medium">
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 0,
              }).format(transaction.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tanggal:</span>
            <span className="font-medium">
              {new Date(transaction.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">{config.description}</p>
      </CardContent>
    </Card>
  )
}
