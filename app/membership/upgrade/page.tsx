import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ContentHeader } from "@/components/content/content-header"
import { UpgradeForm } from "@/components/membership/upgrade-form"
import { getMembershipPlanById } from "@/lib/membership"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface UpgradePageProps {
  searchParams: Promise<{ plan?: string }>
}

export default async function UpgradePage({ searchParams }: UpgradePageProps) {
  const session = await getSession()
  const { plan } = await searchParams

  if (!session) {
    redirect("/login")
  }

  if (!plan) {
    redirect("/membership")
  }

  const selectedPlan = getMembershipPlanById(plan)

  if (!selectedPlan) {
    redirect("/membership")
  }

  return (
    <div className="min-h-screen bg-background">
      <ContentHeader user={session} title="Upgrade Membership" />

      <div className="container py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/membership">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Membership
            </Link>
          </Button>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Upgrade ke {selectedPlan.name}</h1>
            <p className="text-muted-foreground">Konfirmasi upgrade membership Anda</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Detail Paket</CardTitle>
              <CardDescription>Ringkasan paket yang akan Anda pilih</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Paket</span>
                <span>{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Harga</span>
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(selectedPlan.price)}
                  /bulan
                </span>
              </div>
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Fitur yang didapat:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {selectedPlan.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <UpgradeForm plan={selectedPlan} user={session} />
        </div>
      </div>
    </div>
  )
}
