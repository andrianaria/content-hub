import { sql } from "./db"
import type { Article, Video, SessionUser } from "./db"
import { MEMBERSHIP_LIMITS } from "./db"

export async function getArticles(limit?: number): Promise<Article[]> {
  const query = limit
    ? sql`SELECT * FROM articles ORDER BY created_at DESC LIMIT ${limit}`
    : sql`SELECT * FROM articles ORDER BY created_at DESC`

  return query as Promise<Article[]>
}

export async function getVideos(limit?: number): Promise<Video[]> {
  const query = limit
    ? sql`SELECT * FROM videos ORDER BY created_at DESC LIMIT ${limit}`
    : sql`SELECT * FROM videos ORDER BY created_at DESC`

  return query as Promise<Video[]>
}

export async function getArticleById(id: number): Promise<Article | null> {
  const result = await sql`SELECT * FROM articles WHERE id = ${id}`
  return (result[0] as Article) || null
}

export async function getVideoById(id: number): Promise<Video | null> {
  const result = await sql`SELECT * FROM videos WHERE id = ${id}`
  return (result[0] as Video) || null
}

export async function getUserContentAccess(userId: string, contentType: "article" | "video"): Promise<number> {
  const result = await sql`
    SELECT COUNT(*) as count 
    FROM user_content_access 
    WHERE user_id = ${userId} AND content_type = ${contentType}
  `
  return Number.parseInt(result[0].count as string)
}

export async function canUserAccessContent(
  user: SessionUser | null,
  contentType: "article" | "video",
  isPremium: boolean,
): Promise<{ canAccess: boolean; reason?: string }> {
  // Free content is always accessible
  if (!isPremium) {
    return { canAccess: true }
  }

  // Premium content requires authentication
  if (!user) {
    return { canAccess: false, reason: "Login diperlukan untuk mengakses konten premium" }
  }

  if (user.membership_type !== "free") {
    const limits = MEMBERSHIP_LIMITS[user.membership_type]
    const currentAccess = await getUserContentAccess(user.id, contentType)

    if (contentType === "article" && currentAccess >= limits.articles) {
      return {
        canAccess: false,
        reason: "Batas akses artikel telah tercapai. Upgrade membership untuk akses lebih banyak.",
      }
    }

    if (contentType === "video" && currentAccess >= limits.videos) {
      return {
        canAccess: false,
        reason: "Batas akses video telah tercapai. Upgrade membership untuk akses lebih banyak.",
      }
    }
  }

  return { canAccess: true }
}

export async function recordContentAccess(
  userId: string,
  contentType: "article" | "video",
  contentId: number,
): Promise<void> {
  await sql`
    INSERT INTO user_content_access (user_id, content_type, content_id)
    VALUES (${userId}, ${contentType}, ${contentId})
    ON CONFLICT DO NOTHING
  `
}
