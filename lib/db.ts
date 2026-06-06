import { neon } from '@neondatabase/serverless'

type Sql = ReturnType<typeof neon>

let _sql: Sql | null = null

export function getDb(): Sql {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')
    _sql = neon(process.env.DATABASE_URL)
  }
  return _sql
}

export type Row = Record<string, unknown>
