'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '@/lib/store'
import { ParsedTask, TaskPriority } from '@/lib/types'

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  start(): void
  stop(): void
  onresult: ((e: SpeechRecognitionEvent) => void) | null
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null
  onend: (() => void) | null
}

function getSpeechRecognition(): (new () => SpeechRecognitionInstance) | null {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: 'Високий',
  medium: 'Середній',
  low: 'Низький',
}

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function CapturePage() {
  const [input, setInput] = useState('')
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true)
  const [parsing, setParsing] = useState(false)
  const [parsed, setParsed] = useState<ParsedTask[] | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const { addTasks } = useTasks()
  const router = useRouter()

  useEffect(() => {
    if (!getSpeechRecognition()) setSupported(false)
  }, [])

  const handleParse = async () => {
    if (!input.trim()) return
    setParsing(true)
    setError('')
    setParsed(null)
    try {
      const res = await fetch('/api/parse-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input }),
      })
      if (!res.ok) throw new Error('Помилка парсингу')
      const tasks: ParsedTask[] = await res.json()
      setParsed(tasks)
    } catch {
      setError('Не вдалося розібрати задачі. Спробуй ще раз.')
    } finally {
      setParsing(false)
    }
  }

  const handleSave = async () => {
    if (!parsed || parsed.length === 0) return
    setSaving(true)
    await addTasks(parsed)
    setSaving(false)
    setInput('')
    setParsed(null)
    router.push('/inbox')
  }

  const handleReset = () => {
    setParsed(null)
    setError('')
  }

  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop()
      return
    }

    const SR = getSpeechRecognition()
    if (!SR) return

    const recognition = new SR()
    recognition.lang = 'uk-UA'
    recognition.continuous = true
    recognition.interimResults = false

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join(' ')
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript))
    }

    recognition.onerror = (e: SpeechRecognitionErrorEvent) => {
      if (e.error !== 'aborted') setListening(false)
    }

    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setListening(true)
  }

  if (parsed) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 pt-12 pb-6">
          <h1 className="text-white text-2xl font-bold mb-1">Перевір задачі</h1>
          <p className="text-white/70 text-sm">AI розібрав твій текст — перевір і збережи</p>
        </div>
        <div className="flex flex-col flex-1 px-4 pt-5 pb-6">

        <ul className="flex flex-col gap-3 mb-6">
          {parsed.map((task, i) => (
            <li key={i} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-900 mb-2">{task.title}</p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                  {PRIORITY_LABELS[task.priority]}
                </span>
                {task.estimateMin && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path fillRule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7-4.75a.75.75 0 0 0-.75.75v4.25c0 .414.336.75.75.75h2.25a.75.75 0 0 0 0-1.5H9V4A.75.75 0 0 0 8 3.25Z" clipRule="evenodd" />
                    </svg>
                    {task.estimateMin} хв
                  </span>
                )}
                {task.deadline && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M5.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM5 10.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM10.25 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM9.5 10.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0ZM7.75 7.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5ZM7 10.75a.75.75 0 1 1 1.5 0 .75.75 0 0 1-1.5 0Z" />
                      <path fillRule="evenodd" d="M5.75 1a.75.75 0 0 1 .75.75V3h3V1.75a.75.75 0 0 1 1.5 0V3h.75A2.75 2.75 0 0 1 14.5 5.75v7.5A2.75 2.75 0 0 1 11.75 16h-7.5A2.75 2.75 0 0 1 1.5 13.25v-7.5A2.75 2.75 0 0 1 4.25 3H5V1.75A.75.75 0 0 1 5.75 1ZM4.25 4.5c-.69 0-1.25.56-1.25 1.25V6.5h10.5v-.75c0-.69-.56-1.25-1.25-1.25h-8ZM3 8v5.25c0 .69.56 1.25 1.25 1.25h7.5c.69 0 1.25-.56 1.25-1.25V8H3Z" clipRule="evenodd" />
                    </svg>
                    {task.deadline}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full min-h-[48px] rounded-2xl bg-indigo-500 text-white font-semibold text-base shadow hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-40"
          >
            {saving ? 'Зберігаю...' : `Зберегти ${parsed.length} задач${parsed.length === 1 ? 'у' : 'і'}`}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="w-full min-h-[48px] rounded-2xl border border-gray-200 text-gray-600 font-medium text-base hover:bg-gray-50 active:scale-95 transition-all"
          >
            Назад до тексту
          </button>
        </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-bold mb-1">Capture</h1>
        <p className="text-white/70 text-sm">Запиши все, що в голові</p>
      </div>
      <div className="flex flex-col flex-1 px-4 pt-5 pb-6">

      <textarea
        className="flex-1 w-full rounded-2xl border border-gray-200 bg-white p-4 text-gray-900 text-base placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm min-h-[200px]"
        placeholder="Що в голові?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />

      {error && (
        <p className="mt-3 text-sm text-red-500 bg-red-50 rounded-xl px-4 py-2">{error}</p>
      )}

      <div className="flex flex-col items-center gap-4 mt-6">
        {supported && (
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={toggleMic}
              aria-label={listening ? 'Зупинити запис' : 'Диктувати голосом'}
              className={`w-[72px] h-[72px] rounded-full text-white flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                listening
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                  : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {listening ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path fillRule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                  <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
              )}
            </button>
            <span className="text-xs text-gray-400">
              {listening ? 'Говори… натисни щоб зупинити' : 'Диктувати голосом'}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={handleParse}
          disabled={!input.trim() || parsing}
          className="w-full min-h-[48px] rounded-2xl bg-indigo-500 text-white font-semibold text-base shadow hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {parsing ? (
            <>
              <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI аналізує…
            </>
          ) : (
            'Обробити з AI'
          )}
        </button>
      </div>
      </div>
    </div>
  )
}
