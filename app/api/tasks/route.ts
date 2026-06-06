import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDb, Row } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sql = getDb()
  const tasks = await sql`
    SELECT id, title, status, created_at, priority, estimate_min, deadline, scheduled_date
    FROM tasks
    WHERE user_id = ${session.user.id}
    ORDER BY created_at ASC
  ` as Row[]

  return NextResponse.json(tasks)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // Support both old { titles: string[] } and new { tasks: ParsedTask[] }
  const sql = getDb()
  const created: Row[] = []

  if (Array.isArray(body.tasks)) {
    for (const task of body.tasks) {
      const title = task.title?.trim()
      if (!title) continue
      const rows = await sql`
        INSERT INTO tasks (user_id, title, status, priority, estimate_min, deadline)
        VALUES (
          ${session.user.id},
          ${title},
          'inbox',
          ${task.priority ?? null},
          ${task.estimateMin ?? null},
          ${task.deadline ?? null}
        )
        RETURNING id, title, status, created_at, priority, estimate_min, deadline
      ` as Row[]
      created.push(rows[0])
    }
  } else if (Array.isArray(body.titles)) {
    for (const title of body.titles) {
      const trimmed = title.trim()
      if (!trimmed) continue
      const rows = await sql`
        INSERT INTO tasks (user_id, title, status)
        VALUES (${session.user.id}, ${trimmed}, 'inbox')
        RETURNING id, title, status, created_at, priority, estimate_min, deadline
      ` as Row[]
      created.push(rows[0])
    }
  } else {
    return NextResponse.json({ error: 'tasks or titles required' }, { status: 400 })
  }

  return NextResponse.json(created, { status: 201 })
}
