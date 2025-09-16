import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

export const sql = neon(process.env.DATABASE_URL)

// Types for our database entities
export interface User {
  id: string
  email: string
  name: string | null
  password_hash: string | null
  membership_type: "free" | "paket_a" | "paket_b" | "paket_c"
  membership_expires_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface Article {
  id: number
  title: string
  content: string
  thumbnail: string | null
  author_id: string
  is_premium: boolean
  created_at: Date
  updated_at: Date
}

export interface Video {
  id: number
  title: string
  url: string
  description: string | null
  thumbnail: string | null
  author_id: string
  is_premium: boolean
  created_at: Date
  updated_at: Date
}

export interface UserContentAccess {
  id: number
  user_id: string
  content_type: "article" | "video"
  content_id: number
  accessed_at: Date
}

// Membership limits
export const MEMBERSHIP_LIMITS = {
  free: { articles: 0, videos: 0 },
  paket_a: { articles: 5, videos: 5 },
  paket_b: { articles: 10, videos: 10 },
  paket_c: { articles: Number.POSITIVE_INFINITY, videos: Number.POSITIVE_INFINITY },
} as const

// Membership prices in IDR
export const MEMBERSHIP_PRICES = {
  paket_a: 99000,
  paket_b: 199000,
  paket_c: 299000,
} as const
