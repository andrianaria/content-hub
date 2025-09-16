import { getSession } from "@/lib/auth"
import { ContentHeader } from "@/components/content/content-header"
import { MembershipPlans } from "@/components/membership/membership-plans"
import { CurrentMembership } from "@/components/membership/current-membership"
import { Crown } from "lucide-react"
import { redirect } from "next/navigation"

export default async function MembershipPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <ContentHeader user={session} title="Membership" />

      <div className="container py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
            <Crown className="h-8 w-8 mr-3 text-primary" />
            Membership Plans
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Pilih paket membership yang sesuai dengan kebutuhan pembelajaran Anda. Dapatkan akses ke ribuan konten
            premium berkualitas tinggi.
          </p>
        </div>

        {session && <CurrentMembership user={session} />}

        <MembershipPlans currentUser={session} />
      </div>
    </div>
  )
}
