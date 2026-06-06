import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tasks } = await request.json()
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return NextResponse.json({ tip: null })
  }

  const today = new Date().toISOString().split('T')[0]

  const taskList = tasks
    .map((t: { title: string; priority?: string; estimateMin?: number; deadline?: string }) =>
      `- "${t.title}" | пріоритет: ${t.priority ?? 'не вказано'} | час: ${t.estimateMin ? t.estimateMin + ' хв' : 'не відомо'} | дедлайн: ${t.deadline ?? 'немає'}`
    )
    .join('\n')

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 200,
    thinking: { type: 'adaptive' },
    messages: [
      {
        role: 'user',
        content: `Сьогодні ${today}. Ось задачі користувача на сьогодні:\n${taskList}\n\nДай одну коротку пораду (1-2 речення) українською: з якої задачі почати і чому. Враховуй пріоритет, дедлайн, час виконання. Звертайся на "ти". Відповідай тільки порадою, без зайвих слів.`,
      },
    ],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  const tip = textBlock?.type === 'text' ? textBlock.text.trim() : null

  return NextResponse.json({ tip })
}
