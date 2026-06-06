'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, TaskStatus } from './types'

const STORAGE_KEY = 'ai-planner-tasks'

function loadTasks(): Task[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(loadTasks())
  }, [])

  const persist = useCallback((updated: Task[]) => {
    setTasks(updated)
    saveTasks(updated)
  }, [])

  const addTasks = useCallback(
    (titles: string[]) => {
      const newTasks: Task[] = titles
        .map((t) => t.trim())
        .filter(Boolean)
        .map((title) => ({
          id: crypto.randomUUID(),
          title,
          status: 'inbox' as TaskStatus,
          createdAt: Date.now(),
        }))
      persist([...loadTasks(), ...newTasks])
    },
    [persist]
  )

  const moveToToday = useCallback(
    (id: string) => {
      const current = loadTasks()
      persist(
        current.map((t) => (t.id === id ? { ...t, status: 'today' as TaskStatus } : t))
      )
    },
    [persist]
  )

  const toggleDone = useCallback(
    (id: string) => {
      const current = loadTasks()
      persist(
        current.map((t) => {
          if (t.id !== id) return t
          return { ...t, status: t.status === 'done' ? 'today' : ('done' as TaskStatus) }
        })
      )
    },
    [persist]
  )

  const deleteTask = useCallback(
    (id: string) => {
      const current = loadTasks()
      persist(current.filter((t) => t.id !== id))
    },
    [persist]
  )

  return { tasks, addTasks, moveToToday, toggleDone, deleteTask }
}
