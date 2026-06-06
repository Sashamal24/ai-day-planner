import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getDb, Row } from '@/lib/db'

export async function POST(request: Request) {
  const { email, password, name } = await request.json()

  if (!email || !password || password.length < 6) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const sql = getDb()
  const existing = await sql`SELECT id FROM users WHERE email = ${email}` as Row[]
  if (existing.length > 0) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 12)
  await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${email}, ${name ?? null}, ${hash})
  `

  return NextResponse.json({ ok: true })
}
