export type TaskStatus = 'inbox' | 'today' | 'done'
export type TaskPriority = 'high' | 'medium' | 'low'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  created_at: string
  priority?: TaskPriority | null
  estimate_min?: number | null
  deadline?: string | null
}

export interface ParsedTask {
  title: string
  priority: TaskPriority
  estimateMin: number | null
  deadline: string | null
}
