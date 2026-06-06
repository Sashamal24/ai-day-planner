export type TaskStatus = 'inbox' | 'today' | 'done'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  created_at: string
}
