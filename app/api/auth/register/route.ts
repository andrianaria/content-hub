import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, membershipType = "free" } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Semua field harus diisi" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await sql`
      SELECT id FROM users WHERE email = ${email}
    `

    if (existingUser.length > 0) {
      return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 })
    }

    const user = await createUser(email, password, name)

    // Update membership type if not free
    if (membershipType !== "free") {
      await sql`
        UPDATE users 
        SET membership_type = ${membershipType}
        WHERE id = ${user.id}
      `
      user.membership_type = membershipType as any
    }

    await createSession(user)

    return NextResponse.json({
      message: "Registrasi berhasil",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        membership_type: user.membership_type,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 })
  }
}
