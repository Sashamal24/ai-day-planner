'use client'

import { useTasks } from '@/lib/store'
import TaskCard from '@/components/TaskCard'

export default function TodayPage() {
  const { tasks, toggleDone } = useTasks()
  const today = tasks.filter((t) => t.status === 'today' || t.status === 'done')
  const pending = today.filter((t) => t.status === 'today')
  const done = today.filter((t) => t.status === 'done')

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] px-4 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Today</h1>
      <p className="text-sm text-gray-400 mb-6">
        {today.length > 0
          ? `${done.length} з ${today.length} виконано`
          : 'Твій день ще попереду'}
      </p>

      {today.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-gray-200">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
          </svg>
          <p className="text-base font-medium">Сьогодні ще нічого — перевір Inbox!</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {pending.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                checkLabel="Позначити виконаним"
                onCheck={() => toggleDone(task.id)}
              />
            </li>
          ))}
          {done.length > 0 && pending.length > 0 && (
            <li>
              <div className="flex items-center gap-2 mt-2 mb-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">Виконано</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            </li>
          )}
          {done.map((task) => (
            <li key={task.id}>
              <TaskCard
                task={task}
                checkLabel="Повернути у список"
                onCheck={() => toggleDone(task.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
