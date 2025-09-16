import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, BookOpen, PlayCircle } from "lucide-react"
import { getUserMembershipStats, MEMBERSHIP_PLANS } from "@/lib/membership"
import type { SessionUser } from "@/lib/auth"

interface CurrentMembershipProps {
  user: SessionUser
}

export async function CurrentMembership({ user }: CurrentMembershipProps) {
  const stats = await getUserMembershipStats(user.id)
  const currentPlan = MEMBERSHIP_PLANS.find((plan) => plan.id === user.membership_type)

  const membershipLabels = {
    free: "Gratis",
    paket_a: "Paket A",
    paket_b: "Paket B",
    paket_c: "Paket C",
  }

  const articleLimit = currentPlan?.limits.articles || 0
  const videoLimit = currentPlan?.limits.videos || 0

  return (
    <section className="mb-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="h-5 w-5 mr-2 text-primary" />
            Membership Saat Ini
          </CardTitle>
          <CardDescription>Status dan penggunaan membership Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Status Membership</h3>
              <p className="text-sm text-muted-foreground">Paket yang sedang aktif</p>
            </div>
            <Badge variant={user.membership_type === "free" ? "secondary" : "default"} className="text-sm">
              {membershipLabels[user.membership_type]}
            </Badge>
          </div>

          {user.membership_type !== "free" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Artikel</span>
                </div>
                <span className="text-sm font-medium">
                  {stats.articlesAccessed} / {articleLimit === Number.POSITIVE_INFINITY ? "∞" : articleLimit}
                </span>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Video</span>
                </div>
                <span className="text-sm font-medium">
                  {stats.videosAccessed} / {videoLimit === Number.POSITIVE_INFINITY ? "∞" : videoLimit}
                </span>
              </div>
            </div>
          )}

          {user.membership_type === "free" && (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Anda belum memiliki membership premium. Upgrade sekarang untuk mengakses konten eksklusif!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
