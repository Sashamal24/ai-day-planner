'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/lib/store'

function parseInput(text: string): string[] {
  return text
    .split(/[\n,;.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export default function CapturePage() {
  const [input, setInput] = useState('')
  const { addTasks } = useTasks()
  const router = useRouter()

  const handleSubmit = () => {
    const titles = parseInput(input)
    if (titles.length === 0) return
    addTasks(titles)
    setInput('')
    router.push('/inbox')
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] px-4 pt-8 pb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Capture</h1>
      <p className="text-sm text-gray-400 mb-4">Запиши все, що в голові — по одному або списком</p>

      <textarea
        className="flex-1 w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 text-base placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm min-h-[200px]"
        placeholder="Що в голові?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />

      <div className="flex flex-col items-center gap-4 mt-6">
        {/* Mic button */}
        <button
          type="button"
          aria-label="Диктувати голосом"
          className="w-[72px] h-[72px] rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg hover:bg-indigo-600 active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
            <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
            <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
          </svg>
        </button>

        {/* Submit button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full min-h-[48px] rounded-2xl bg-indigo-500 text-white font-semibold text-base shadow hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Обробити
        </button>
      </div>
    </div>
  )
}
