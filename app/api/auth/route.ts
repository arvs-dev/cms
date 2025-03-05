import { NextResponse } from "next/server"
import { findUserByEmail, createUser } from "@/lib/db"
import { cookies } from "next/headers"

// In a real app, you would use a proper authentication library and JWT
// This is a simplified example for demonstration purposes

export async function POST(request: Request) {
  try {
    const { email, password, name, action } = await request.json()

    if (action === "login") {
      const user = await findUserByEmail(email)

      if (!user || user.password !== password) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
      }

      // In a real app, you would use JWT or another token-based auth
      const { password: _, ...userWithoutPassword } = user

      // Set a cookie for authentication
      cookies().set("auth", JSON.stringify(userWithoutPassword), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return NextResponse.json({ user: userWithoutPassword })
    }

    if (action === "register") {
      const existingUser = await findUserByEmail(email)

      if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 })
      }

      const newUser = await createUser({
        name,
        email,
        password,
        role: "member",
      })

      const { password: _, ...userWithoutPassword } = newUser

      // Set a cookie for authentication
      cookies().set("auth", JSON.stringify(userWithoutPassword), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return NextResponse.json({ user: userWithoutPassword })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE() {
  // Logout - clear the auth cookie
  cookies().delete("auth")
  return NextResponse.json({ success: true })
}

