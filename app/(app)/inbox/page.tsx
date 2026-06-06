'use client'

import { useTasks } from '@/lib/store'
import TaskCard from '@/components/TaskCard'

export default function InboxPage() {
  const { tasks, moveToToday, deleteTask } = useTasks()
  const inbox = tasks.filter((t) => t.status === 'inbox')

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">Inbox</h1>
        <p className="text-white/70 text-sm">
          {inbox.length > 0 ? `${inbox.length} задач чекають на розбір` : 'Порожньо — добре!'}
        </p>
      </div>

      <div className="flex-1 px-4 pt-5 pb-6">
        {inbox.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 pt-16">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-300">
                <path fillRule="evenodd" d="M6.912 3a3 3 0 0 0-2.868 2.118l-2.411 7.838a3 3 0 0 0-.133.882V18a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0 0 17.088 3H6.912Zm13.823 9.75-2.213-7.191A1.5 1.5 0 0 0 17.088 4.5H6.912a1.5 1.5 0 0 0-1.434 1.059L3.265 12.75H6.11a3 3 0 0 1 2.684 1.658l.256.513a1.5 1.5 0 0 0 1.342.829h3.218a1.5 1.5 0 0 0 1.342-.83l.256-.512a3 3 0 0 1 2.684-1.658h2.844Z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-500">Inbox порожній</p>
            <p className="text-sm text-gray-400">Поверніся і диктуй нові задачі!</p>
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
    </div>
  )
}
