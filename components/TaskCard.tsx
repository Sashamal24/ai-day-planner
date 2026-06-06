'use client'

import { Task } from '@/lib/types'

interface TaskCardProps {
  task: Task
  onCheck?: () => void
  onDelete?: () => void
  checkLabel?: string
}

export default function TaskCard({ task, onCheck, onDelete, checkLabel }: TaskCardProps) {
  const isDone = task.status === 'done'

  return (
    <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
      {onCheck && (
        <button
          onClick={onCheck}
          aria-label={checkLabel ?? 'Toggle task'}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-indigo-400 flex items-center justify-center transition-colors hover:bg-indigo-50"
          style={{ minWidth: 24, minHeight: 24 }}
        >
          {isDone && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-indigo-500">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      )}

      <span
        className={`flex-1 text-sm text-gray-800 leading-snug ${
          isDone ? 'line-through text-gray-400' : ''
        }`}
      >
        {task.title}
      </span>

      {onDelete && (
        <button
          onClick={onDelete}
          aria-label="Delete task"
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 3.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </div>
  )
}
