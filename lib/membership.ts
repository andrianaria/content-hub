import { sql } from "./db"
import type { User } from "./db"
import { MEMBERSHIP_PRICES, MEMBERSHIP_LIMITS } from "./db"

export interface MembershipPlan {
  id: "paket_a" | "paket_b" | "paket_c"
  name: string
  price: number
  features: string[]
  limits: {
    articles: number
    videos: number
  }
  popular?: boolean
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "paket_a",
    name: "Paket A",
    price: MEMBERSHIP_PRICES.paket_a,
    limits: MEMBERSHIP_LIMITS.paket_a,
    features: ["Akses 5 artikel premium", "Akses 5 video tutorial", "Support email", "Akses komunitas Discord"],
  },
  {
    id: "paket_b",
    name: "Paket B",
    price: MEMBERSHIP_PRICES.paket_b,
    limits: MEMBERSHIP_LIMITS.paket_b,
    popular: true,
    features: [
      "Akses 10 artikel premium",
      "Akses 10 video tutorial",
      "Priority support",
      "Akses komunitas Discord",
      "Monthly webinar",
    ],
  },
  {
    id: "paket_c",
    name: "Paket C",
    price: MEMBERSHIP_PRICES.paket_c,
    limits: MEMBERSHIP_LIMITS.paket_c,
    features: [
      "Akses unlimited artikel",
      "Akses unlimited video",
      "1-on-1 mentoring session",
      "Sertifikat completion",
      "Priority support",
      "Akses komunitas Discord",
      "Monthly webinar",
    ],
  },
]

export async function updateUserMembership(
  userId: string,
  membershipType: "paket_a" | "paket_b" | "paket_c",
): Promise<User> {
  const expiresAt = new Date()
  expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month from now

  const result = await sql`
    UPDATE users 
    SET membership_type = ${membershipType}, 
        membership_expires_at = ${expiresAt.toISOString()},
        updated_at = NOW()
    WHERE id = ${userId}
    RETURNING *
  `

  return result[0] as User
}

export async function getUserMembershipStats(userId: string) {
  const [articleAccess, videoAccess] = await Promise.all([
    sql`
      SELECT COUNT(*) as count 
      FROM user_content_access 
      WHERE user_id = ${userId} AND content_type = 'article'
    `,
    sql`
      SELECT COUNT(*) as count 
      FROM user_content_access 
      WHERE user_id = ${userId} AND content_type = 'video'
    `,
  ])

  return {
    articlesAccessed: Number.parseInt(articleAccess[0].count as string),
    videosAccessed: Number.parseInt(videoAccess[0].count as string),
  }
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}

export function getMembershipPlanById(id: string): MembershipPlan | null {
  return MEMBERSHIP_PLANS.find((plan) => plan.id === id) || null
}
