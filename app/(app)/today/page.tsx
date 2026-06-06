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
      <circle cx="50" cy="50" r={r} fill="none" stroke="white" strokeWidth="10" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`} className="transition-all duration-700" />
    </svg>
  )
}

function SmartTip({ tasks }: { tasks: Task[] }) {
  const [tip, setTip] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const payload = tasks.map((t) => ({
      title: t.title, priority: t.priority, estimateMin: t.estimate_min, deadline: t.deadline,
    }))
    fetch('/api/smart-tip', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
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

// --- Week view ---

const DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд']

function getWeekDates(): Date[] {
  const today = new Date()
  const dow = today.getDay() === 0 ? 6 : today.getDay() - 1 // Mon=0
  const monday = new Date(today)
  monday.setDate(today.getDate() - dow)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

function toISO(d: Date) {
  return d.toISOString().split('T')[0]
}

function DayPickerModal({ task, onClose, onSelect }: {
  task: Task
  onClose: () => void
  onSelect: (date: string | null) => void
}) {
  const days = getWeekDates()
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white w-full max-w-md rounded-t-3xl px-5 pt-5 pb-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{task.title}</p>
        <p className="text-xs text-gray-400 mb-4">Обери день тижня</p>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {days.map((d) => {
            const iso = toISO(d)
            const isSelected = task.scheduled_date === iso
            const isToday = toISO(new Date()) === iso
            return (
              <button key={iso} onClick={() => onSelect(iso)}
                className={`flex flex-col items-center py-2 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-gradient-to-b from-blue-600 to-violet-600 text-white'
                    : isToday
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}>
                <span className="text-[10px] font-medium">{DAY_NAMES[days.indexOf(d)]}</span>
                <span className="text-sm font-bold">{d.getDate()}</span>
              </button>
            )
          })}
        </div>
        {task.scheduled_date && (
          <button onClick={() => onSelect(null)}
            className="w-full py-2.5 text-sm text-red-400 hover:text-red-500 font-medium">
            Зняти з розкладу
          </button>
        )}
      </div>
    </div>
  )
}

function WeekView({ tasks, scheduleTask }: { tasks: Task[]; scheduleTask: (id: string, date: string | null) => Promise<void> }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const days = getWeekDates()
  const todayISO = toISO(new Date())
  const activeTasks = tasks.filter((t) => t.status !== 'done')

  const unscheduled = activeTasks.filter((t) => !t.scheduled_date)

  return (
    <div>
      {/* Days strip */}
      <div className="flex gap-1 mb-5 overflow-x-auto pb-1">
        {days.map((d) => {
          const iso = toISO(d)
          const isToday = iso === todayISO
          const count = activeTasks.filter((t) => t.scheduled_date === iso).length
          return (
            <div key={iso} className={`flex-shrink-0 flex flex-col items-center rounded-2xl px-3 py-2 min-w-[44px] ${
              isToday ? 'bg-gradient-to-b from-blue-600 to-violet-600' : 'bg-white border border-gray-100'
            }`}>
              <span className={`text-[10px] font-medium ${isToday ? 'text-white/70' : 'text-gray-400'}`}>
                {DAY_NAMES[days.indexOf(d)]}
              </span>
              <span className={`text-base font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
                {d.getDate()}
              </span>
              {count > 0 && (
                <span className={`text-[9px] font-semibold mt-0.5 ${isToday ? 'text-white/80' : 'text-indigo-500'}`}>
                  {count}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Tasks per day */}
      {days.map((d) => {
        const iso = toISO(d)
        const dayTasks = activeTasks.filter((t) => t.scheduled_date === iso)
        if (dayTasks.length === 0) return null
        return (
          <div key={iso} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              {DAY_NAMES[days.indexOf(d)]}, {d.getDate()}
            </p>
            <ul className="flex flex-col gap-2">
              {dayTasks.map((task) => (
                <li key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                  <TaskCard task={task} />
                </li>
              ))}
            </ul>
          </div>
        )
      })}

      {/* Unscheduled */}
      {unscheduled.length > 0 && (
        <div className="mt-2">
          <p className="text-xs font-semibold text-gray-400 mb-2">Не заплановано</p>
          <ul className="flex flex-col gap-2">
            {unscheduled.map((task) => (
              <li key={task.id} onClick={() => setSelectedTask(task)} className="cursor-pointer">
                <TaskCard task={task} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTasks.length === 0 && (
        <div className="flex flex-col items-center justify-center text-center gap-3 pt-12">
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-indigo-300">
              <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-500">Немає активних задач</p>
          <p className="text-sm text-gray-400">Додай задачі в Capture</p>
        </div>
      )}

      {selectedTask && (
        <DayPickerModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSelect={async (date) => {
            await scheduleTask(selectedTask.id, date)
            setSelectedTask(null)
          }}
        />
      )}
    </div>
  )
}

// --- Main page ---

export default function TodayPage() {
  const [view, setView] = useState<'today' | 'week'>('today')
  const { tasks, loading, toggleDone, scheduleTask } = useTasks()

  const todayTasks = tasks.filter((t) => t.status === 'today' || t.status === 'done')
  const pending = todayTasks.filter((t) => t.status === 'today')
  const doneTasks = tasks.filter((t) => t.status === 'done')
  const total = tasks.length
  const percent = total > 0 ? Math.round((doneTasks.length / total) * 100) : 0

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Доброго ранку' : hour < 18 ? 'Добрий день' : 'Добрий вечір'

  return (
    <div className="flex flex-col min-h-screen">
      {/* Gradient hero */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 pt-12 pb-5">
        <button onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="absolute top-12 right-5 text-xs text-white/60 hover:text-white/90 transition-colors font-medium">
          Вийти
        </button>
        <p className="text-white/70 text-sm font-medium mb-1">{greeting} 👋</p>
        <h1 className="text-white text-xl font-bold leading-tight mb-4">
          Зробимо сьогодні продуктивним
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
              <span className="text-white font-semibold text-sm">{doneTasks.length}</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex items-center justify-between">
              <span className="text-white/70 text-xs">Залишилось</span>
              <span className="text-white font-semibold text-sm">{pending.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-50 px-4 pt-4 pb-4">
        {/* Tab switcher */}
        <div className="flex bg-white rounded-2xl p-1 mb-4 border border-gray-100">
          <button onClick={() => setView('today')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              view === 'today'
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}>
            Сьогодні
          </button>
          <button onClick={() => setView('week')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              view === 'week'
                ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-600'
            }`}>
            Тиждень
          </button>
        </div>

        {view === 'today' ? (
          <div className="flex flex-col gap-4">
            {!loading && pending.length > 0 && <SmartTip tasks={pending} />}

            <h2 className="text-base font-bold text-gray-900">Задачі на сьогодні</h2>

            {todayTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center gap-3 pt-12">
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
                {doneTasks.length > 0 && pending.length > 0 && (
                  <li className="flex items-center gap-2 my-1">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs text-gray-400 font-medium">Виконано</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </li>
                )}
                {doneTasks.map((task) => (
                  <li key={task.id}>
                    <TaskCard task={task} checkLabel="Повернути у список" onCheck={() => toggleDone(task.id)} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <WeekView tasks={tasks} scheduleTask={scheduleTask} />
        )}
      </div>
    </div>
  )
}
