'use client'

import { useState, useEffect, useCallback } from 'react'
import { Task, TaskStatus, ParsedTask } from './types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const res = await fetch('/api/tasks')
    if (res.ok) setTasks(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTasks = useCallback(async (tasks: ParsedTask[] | string[]) => {
    const body = typeof tasks[0] === 'string'
      ? { titles: tasks as string[] }
      : { tasks: tasks as ParsedTask[] }
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (res.ok) {
      const created: Task[] = await res.json()
      setTasks((prev) => [...prev, ...created])
    }
  }, [])

  const updateStatus = useCallback(async (id: string, status: TaskStatus) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)))
    }
  }, [])

  const moveToToday = useCallback((id: string) => updateStatus(id, 'today'), [updateStatus])

  const toggleDone = useCallback(
    (id: string) => {
      const task = tasks.find((t) => t.id === id)
      if (!task) return Promise.resolve()
      return updateStatus(id, task.status === 'done' ? 'today' : 'done')
    },
    [tasks, updateStatus]
  )

  const deleteTask = useCallback(async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { tasks, loading, addTasks, moveToToday, toggleDone, deleteTask }
}
