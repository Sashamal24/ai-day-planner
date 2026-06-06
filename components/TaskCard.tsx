'use client'

import { Task, TaskPriority } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onCheck?: () => void
  onDelete?: () => void
  checkLabel?: string
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: '↑',
  medium: '→',
  low: '↓',
}

export default function TaskCard({ task, onCheck, onDelete, checkLabel }: TaskCardProps) {
  const isDone = task.status === 'done'

  return (
    <div className="flex items-start gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      {onCheck && (
        <button
          onClick={onCheck}
          aria-label={checkLabel ?? 'Toggle task'}
          className="flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 border-indigo-400 flex items-center justify-center transition-colors hover:bg-indigo-50"
          style={{ minWidth: 24, minHeight: 24 }}
        >
          {isDone && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}

      <div className="flex-1 min-w-0">
        <span
          className={`block text-sm text-gray-800 leading-snug ${
            isDone ? 'line-through text-gray-400' : ''
          }`}
        >
          {task.title}
        </span>

        {(task.priority || task.estimate_min || task.deadline) && (
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {task.priority && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                {PRIORITY_LABELS[task.priority]} {task.priority === 'high' ? 'Високий' : task.priority === 'medium' ? 'Середній' : 'Низький'}
              </span>
            )}
            {task.estimate_min && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7-4.75a.75.75 0 0 0-.75.75v4.25c0 .414.336.75.75.75h2.25a.75.75 0 0 0 0-1.5H9V4A.75.75 0 0 0 8 3.25Z" clipRule="evenodd" />
                </svg>
                {task.estimate_min} хв
              </span>
            )}
            {task.deadline && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                  <path fillRule="evenodd" d="M5.75 1a.75.75 0 0 1 .75.75V3h3V1.75a.75.75 0 0 1 1.5 0V3h.75A2.75 2.75 0 0 1 14.5 5.75v7.5A2.75 2.75 0 0 1 11.75 16h-7.5A2.75 2.75 0 0 1 1.5 13.25v-7.5A2.75 2.75 0 0 1 4.25 3H5V1.75A.75.75 0 0 1 5.75 1ZM4.25 4.5c-.69 0-1.25.56-1.25 1.25V6.5h10.5v-.75c0-.69-.56-1.25-1.25-1.25h-8ZM3 8v5.25c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V8H3Z" clipRule="evenodd" />
                </svg>
                {task.deadline}
              </span>
            )}
          </div>
        )}
      </div>

      {onDelete && (
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="flex-shrink-0 mt-0.5 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}
