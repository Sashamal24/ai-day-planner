'use client'

import { useTasks } from '@/lib/store'
import TaskCard from '@/components/TaskCard'

export default function InboxPage() {
  const { tasks, moveToToday, deleteTask } = useTasks()
  const inbox = tasks.filter((t) => t.status === 'inbox')

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] px-4 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Inbox</h1>
      <p className="text-sm text-gray-400 mb-6">Розбери та відправ у Today</p>

      {inbox.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-200">
            <path fillRule="evenodd" d="M2.625 6.75a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0A.75.75 0 0 1 8.25 6h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75ZM2.625 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0ZM7.5 12a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12A.75.75 0 0 1 7.5 12Zm-4.875 5.25a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875 0a.75.75 0 0 1 .75-.75h12a.75.75 0 0 1 0 1.5h-12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
          </svg>
          <p className="text-base font-medium">Inbox порожній — поверніся і диктуй!</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {inbox.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                checkLabel="Перемістити у Today"
                onCheck={() => moveToToday(task.id)}
                onDelete={() => deleteTask(task.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
