import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { text } = await request.json()
  if (!text?.trim()) return NextResponse.json({ error: 'text required' }, { status: 400 })

  const today = new Date().toISOString().split('T')[0]

  const response = await client.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 2000,
    thinking: { type: 'adaptive' },
    messages: [
      {
        role: 'user',
        content: `Today is ${today}. Parse the following brain dump into individual tasks. Return ONLY a JSON array, no explanation.

Each task object must have:
- "title": string (clear, actionable task name in the same language as the input)
- "priority": "high" | "medium" | "low"
- "estimateMin": number | null (estimated minutes to complete, null if unknown)
- "deadline": string | null (ISO date YYYY-MM-DD if mentioned, null otherwise)

Input:
${text}

Return only the JSON array.`,
      },
    ],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
  }

  const jsonMatch = textBlock.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 })
  }

  const tasks = JSON.parse(jsonMatch[0])
  return NextResponse.json(tasks)
}
