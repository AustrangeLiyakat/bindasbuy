import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

const secretKey = process.env.JWT_SECRET || "your-secret-key"

export async function encrypt(payload: any) {
  return jwt.sign(payload, secretKey, {
    expiresIn: "24h",
    algorithm: "HS256",
  })
}

export async function decrypt(input: string): Promise<any> {
  try {
    const payload = jwt.verify(input, secretKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("JWT verification failed:", error)
    return null
  }
}

export function verifyToken(token: string): any {
  try {
    const payload = jwt.verify(token, secretKey, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    console.error("Token verification failed:", error)
    return null
  }
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, secretKey, {
    expiresIn: "24h",
    algorithm: "HS256",
  })
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function isCollegeEmail(email: string): boolean {
  const collegeEmailPatterns = [/\.edu$/, /\.ac\./, /university\./, /college\./, /student\./]
  return collegeEmailPatterns.some((pattern) => pattern.test(email.toLowerCase()))
}

export async function getSession() {
  try {
    const sessionCookie = cookies().get("session")?.value
    if (!sessionCookie) return null

    const session = await decrypt(sessionCookie)
    return session
  } catch (error) {
    console.error("Session retrieval failed:", error)
    return null
  }
}

export async function createSession(userId: string, userData: any) {
  try {
    const session = await encrypt({ userId, ...userData })
    cookies().set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
  } catch (error) {
    console.error("Session creation failed:", error)
    throw error
  }
}

export async function deleteSession() {
  try {
    cookies().delete("session")
  } catch (error) {
    console.error("Session deletion failed:", error)
  }
}
