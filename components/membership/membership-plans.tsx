import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import Link from "next/link"
import { MEMBERSHIP_PLANS, formatPrice } from "@/lib/membership"
import type { SessionUser } from "@/lib/auth"

interface MembershipPlansProps {
  currentUser: SessionUser | null
}

export function MembershipPlans({ currentUser }: MembershipPlansProps) {
  return (
    <section className="py-8">
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {MEMBERSHIP_PLANS.map((plan) => {
          const isCurrentPlan = currentUser?.membership_type === plan.id
          const isUpgrade = currentUser && !isCurrentPlan

          return (
            <Card key={plan.id} className={`relative ${plan.popular ? "border-primary shadow-lg" : ""}`}>
              {plan.popular && <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2">Populer</Badge>}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="py-4">
                  <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
                  <span className="text-muted-foreground">/bulan</span>
                </div>
                <CardDescription>
                  {plan.limits.articles === Number.POSITIVE_INFINITY
                    ? "Unlimited akses"
                    : `${plan.limits.articles} artikel & ${plan.limits.videos} video`}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4">
                  {isCurrentPlan ? (
                    <Button disabled className="w-full">
                      Paket Aktif
                    </Button>
                  ) : (
                    <Button asChild className="w-full">
                      <Link href={`/membership/upgrade?plan=${plan.id}`}>
                        {isUpgrade ? "Upgrade ke" : "Pilih"} {plan.name}
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
