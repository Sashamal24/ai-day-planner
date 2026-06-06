import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getDb, Row } from '@/lib/db'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const sql = getDb()

  if ('scheduled_date' in body) {
    const rows = await sql`
      UPDATE tasks
      SET scheduled_date = ${body.scheduled_date ?? null}
      WHERE id = ${id} AND user_id = ${session.user.id}
      RETURNING id, title, status, created_at, priority, estimate_min, deadline, scheduled_date
    ` as Row[]
    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(rows[0])
  }

  const allowed = ['inbox', 'today', 'done']
  if (!allowed.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const rows = await sql`
    UPDATE tasks
    SET status = ${body.status}
    WHERE id = ${id} AND user_id = ${session.user.id}
    RETURNING id, title, status, created_at, priority, estimate_min, deadline, scheduled_date
  ` as Row[]

  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(rows[0])
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const sql = getDb()
  await sql`
    DELETE FROM tasks
    WHERE id = ${id} AND user_id = ${session.user.id}
  `

  return new NextResponse(null, { status: 204 })
}
