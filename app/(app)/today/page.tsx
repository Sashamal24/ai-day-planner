'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useTasks } from '@/lib/store'
import TaskCard from '@/components/TaskCard'
import { Task } from '@/lib/types'

function ProgressRing({ percent }: { percent: number }) {
  const r = 42
  const circ = 2 * Math.PI * r
  const dash = (percent / 100) * circ

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke="white"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        className="transition-all duration-700"
      />
    </svg>
  )
}

function SmartTip({ tasks }: { tasks: Task[] }) {
  const [tip, setTip] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const payload = tasks.map((t) => ({
      title: t.title,
      priority: t.priority,
      estimateMin: t.estimate_min,
      deadline: t.deadline,
    }))

    fetch('/api/smart-tip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: payload }),
    })
      .then((r) => r.json())
      .then((data) => setTip(data.tip ?? null))
      .catch(() => setTip(null))
      .finally(() => setLoading(false))
  }, [tasks.length])

  if (!loading && !tip) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 px-4 py-3 flex gap-3 items-start">
      <span className="text-lg mt-0.5">✨</span>
      <div className="flex-1">
        <p className="text-xs font-semibold text-indigo-500 mb-1">AI підказка</p>
        {loading ? (
          <div className="flex flex-col gap-1.5">
            <div className="h-3 bg-gray-100 rounded-full animate-pulse w-full" />
            <div className="h-3 bg-gray-100 rounded-full animate-pulse w-3/4" />
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-snug">{tip}</p>
        )}
      </div>
    </div>
  )
}

export default function TodayPage() {
  const { tasks, loading, toggleDone } = useTasks()
  const todayTasks = tasks.filter((t) => t.status === 'today' || t.status === 'done')
  const pending = todayTasks.filter((t) => t.status === 'today')
  const done = tasks.filter((t) => t.status === 'done')
  const total = tasks.length
  const percent = total > 0 ? Math.round((done.length / total) * 100) : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Доброго ранку' : hour < 18 ? 'Добрий день' : 'Добрий вечір'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Gradient hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 pt-12 pb-5">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="absolute top-12 right-5 text-xs text-white/60 hover:text-white/90 transition-colors font-medium"
        >
          Вийти
        </button>

        <p className="text-white/70 text-sm font-medium mb-1">{greeting} 👋</p>
        <h1 className="text-white text-xl font-bold leading-tight mb-4">
          Зробимо сьогодні<br />продуктивним
        </h1>

        <div className="bg-white/15 backdrop-blur-sm rounded-3xl p-5 flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <ProgressRing percent={percent} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-lg">{percent}%</span>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Всього задач</span>
              <span className="text-white font-semibold text-sm">{total}</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Виконано</span>
              <span className="text-white font-semibold text-sm">{done.length}</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Залишилось</span>
              <span className="text-white font-semibold text-sm">{pending.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 bg-gray-50 px-4 pt-4 pb-4">
        {!loading && pending.length > 0 && <SmartTip tasks={pending} />}
        <h2 className="text-base font-bold text-gray-900 mb-4 mt-4">Задачі на сьогодні</h2>

        {todayTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-3 pt-16 text-gray-400">
            <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-300">
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-500">Сьогодні ще нічого</p>
            <p className="text-sm text-gray-400">Перейди в Inbox і відправ задачі сюди</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {pending.map((task) => (
              <li key={task.id}>
                <TaskCard task={task} checkLabel="Позначити виконаним" onCheck={() => toggleDone(task.id)} />
              </li>
            ))}
            {done.length > 0 && pending.length > 0 && (
              <li className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">Виконано</span>
                <div className="flex-1 h-px bg-gray-200" />
              </li>
            )}
            {done.map((task) => (
              <li key={task.id}>
                <TaskCard task={task} checkLabel="Повернути у список" onCheck={() => toggleDone(task.id)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
