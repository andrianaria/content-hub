import { sql } from "./db"
import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "./db"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key")

export interface SessionUser {
  id: string
  email: string
  name: string | null
  membership_type: "free" | "paket_a" | "paket_b" | "paket_c"
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createUser(email: string, password: string, name: string): Promise<User> {
  const hashedPassword = await hashPassword(password)
  const userId = crypto.randomUUID()

  const result = await sql`
    INSERT INTO users (id, email, name, password_hash, membership_type)
    VALUES (${userId}, ${email}, ${name}, ${hashedPassword}, 'paket_a')
    RETURNING *
  `

  return result[0] as User
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users WHERE email = ${email}
  `

  if (result.length === 0) return null

  const user = result[0] as User
  if (!user.password_hash) return null

  const isValid = await verifyPassword(password, user.password_hash)
  return isValid ? user : null
}

export async function createOAuthUser(
  email: string,
  name: string,
  provider: string,
  providerId: string,
): Promise<User> {
  const userId = crypto.randomUUID()

  const result = await sql`
    INSERT INTO users (id, email, name, oauth_provider, oauth_provider_id, membership_type)
    VALUES (${userId}, ${email}, ${name}, ${provider}, ${providerId}, 'paket_a')
    RETURNING *
  `

  return result[0] as User
}

export async function findOrCreateOAuthUser(
  email: string,
  name: string,
  provider: string,
  providerId: string,
): Promise<User> {
  // Check if user exists with this OAuth provider
  const existingResult = await sql`
    SELECT * FROM users WHERE oauth_provider = ${provider} AND oauth_provider_id = ${providerId}
  `

  if (existingResult.length > 0) {
    return existingResult[0] as User
  }

  // Check if user exists with this email
  const emailResult = await sql`
    SELECT * FROM users WHERE email = ${email}
  `

  if (emailResult.length > 0) {
    // Link OAuth to existing account
    const updateResult = await sql`
      UPDATE users 
      SET oauth_provider = ${provider}, oauth_provider_id = ${providerId}
      WHERE email = ${email}
      RETURNING *
    `
    return updateResult[0] as User
  }

  // Create new OAuth user
  return createOAuthUser(email, name, provider, providerId)
}

export async function createSession(user: User): Promise<string> {
  const sessionUser: SessionUser = {
    id: user.id,
    email: user.email,
    name: user.name,
    membership_type: user.membership_type,
  }

  const token = await new SignJWT(sessionUser)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })

  return token
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("session")?.value

    if (!token) return null

    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionUser
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession()
  if (!session) {
    throw new Error("Authentication required")
  }
  return session
}
