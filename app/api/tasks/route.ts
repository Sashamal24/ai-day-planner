import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDb, Row } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = getDb()
  const tasks = await sql`
    SELECT id, title, status, created_at
    FROM tasks
    WHERE user_id = ${session.user.id}
    ORDER BY created_at ASC
  ` as Row[]

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { titles } = await request.json()
  if (!Array.isArray(titles) || titles.length === 0) {
    return NextResponse.json({ error: 'titles required' }, { status: 400 })
  }

  const sql = getDb()
  const created: Row[] = []
  for (const title of titles) {
    const trimmed = title.trim()
    if (!trimmed) continue
    const rows = await sql`
      INSERT INTO tasks (user_id, title, status)
      VALUES (${session.user.id}, ${trimmed}, 'inbox')
      RETURNING id, title, status, created_at
    ` as Row[]
    created.push(rows[0])
  }

  return NextResponse.json(created, { status: 201 })
}
