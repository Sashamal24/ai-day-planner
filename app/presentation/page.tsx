import Link from 'next/link'

function FeatureBlock({ icon, title, description, detail, mockup }: {
  icon: string
  title: string
  description: string
  detail: string[]
  mockup: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-bold text-gray-900 text-base">{title}</h3>
            <p className="text-sm text-gray-400">{description}</p>
          </div>
        </div>
        <ul className="flex flex-col gap-1.5 mb-4">
          {detail.map((d) => (
            <li key={d} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-4">
        {mockup}
      </div>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
        {number}
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-white/70 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}

export default function PresentationPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 pt-16 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white blur-3xl" />
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">Claude Opus 4.8 · AI-powered</span>
          </div>
          <h1 className="text-5xl font-extrabold text-white mb-3 leading-tight tracking-tight">Planny</h1>
          <p className="text-white/80 text-lg mb-2 max-w-sm mx-auto leading-relaxed font-medium">
            Твій AI-асистент для планування дня
          </p>
          <p className="text-white/60 text-sm mb-8 max-w-xs mx-auto">
            Просто виклади що в голові — Planny сам розбере задачі, розставить пріоритети і скаже з чого почати
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-base"
          >
            Спробувати безкоштовно →
          </Link>
        </div>
      </div>

      {/* AI parse mockup */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 pb-10">
        <div className="max-w-sm mx-auto bg-white/10 backdrop-blur rounded-3xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-white/40 text-xs ml-1">planny.app / capture</span>
          </div>
          <div className="bg-white rounded-2xl p-4 text-left">
            <p className="text-xs text-gray-400 mb-2">Що в голові?</p>
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 italic mb-3 leading-relaxed">
              "Подзвонити клієнту терміново, купити продукти до п'ятниці, підготувати звіт на 2 години"
            </div>
            <div className="flex items-center gap-2 justify-center py-1 mb-3">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-indigo-500 font-semibold">✨ AI обробляє…</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>
            <div className="flex flex-col gap-2">
              {[
                { title: 'Подзвонити клієнту', p: 'Високий', c: 'bg-red-100 text-red-700', t: '15 хв', d: null },
                { title: 'Підготувати звіт', p: 'Середній', c: 'bg-yellow-100 text-yellow-700', t: '2 год', d: null },
                { title: 'Купити продукти', p: 'Низький', c: 'bg-green-100 text-green-700', t: null, d: '2025-06-06' },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-xl px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-800 font-semibold">{item.title}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.c}`}>{item.p}</span>
                  </div>
                  <div className="flex gap-3">
                    {item.t && <span className="text-[10px] text-gray-400">⏱ {item.t}</span>}
                    {item.d && <span className="text-[10px] text-gray-400">📅 {item.d}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features detailed */}
      <div className="px-4 py-10 max-w-md mx-auto">
        <p className="text-xs font-semibold text-indigo-500 text-center tracking-widest uppercase mb-2">Можливості</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-6">Що вміє Planny</h2>

        <FeatureBlock
          icon="🤖"
          title="AI-парсинг задач"
          description="Powered by Claude Opus 4.8"
          detail={[
            'Розбиває довільний текст на окремі задачі',
            'Автоматично визначає пріоритет кожної задачі',
            'Оцінює скільки часу займе виконання',
            'Розпізнає дедлайни з природної мови ("до п\'ятниці")',
          ]}
          mockup={
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-400 mb-1">Вхідний текст → структуровані задачі</p>
              <div className="bg-white rounded-xl p-3 text-xs text-gray-500 italic border border-gray-100">
                "зустріч з командою завтра о 10, написати пропозицію клієнту до середи, оновити сайт"
              </div>
              <div className="flex items-center gap-2">
                <div className="h-px bg-gray-200 flex-1" />
                <span className="text-indigo-400 text-xs">Claude Opus 4.8</span>
                <div className="h-px bg-gray-200 flex-1" />
              </div>
              {[
                { t: 'Зустріч з командою', p: 'Середній', e: '60 хв', d: '2025-06-07', pc: 'bg-yellow-100 text-yellow-700' },
                { t: 'Пропозиція клієнту', p: 'Високий', e: '90 хв', d: '2025-06-11', pc: 'bg-red-100 text-red-700' },
                { t: 'Оновити сайт', p: 'Низький', e: null, d: null, pc: 'bg-green-100 text-green-700' },
              ].map((item) => (
                <div key={item.t} className="bg-gray-50 rounded-xl px-3 py-2">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-semibold text-gray-800">{item.t}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${item.pc}`}>{item.p}</span>
                  </div>
                  <div className="flex gap-3">
                    {item.e && <span className="text-[10px] text-gray-400">⏱ {item.e}</span>}
                    {item.d && <span className="text-[10px] text-gray-400">📅 {item.d}</span>}
                  </div>
                </div>
              ))}
            </div>
          }
        />

        <FeatureBlock
          icon="🎙️"
          title="Голосовий ввід"
          description="Web Speech API · Українська мова"
          detail={[
            'Диктуй задачі голосом без рук',
            'Підтримка української мови',
            'Безперервний запис — зупиняєш коли готовий',
            'Поєднується з AI-парсингом для повного потоку',
          ]}
          mockup={
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-7 h-7">
                  <path d="M8.25 4.5a3.75 3.75 0 1 1 7.5 0v8.25a3.75 3.75 0 1 1-7.5 0V4.5Z" />
                  <path d="M6 10.5a.75.75 0 0 1 .75.75v1.5a5.25 5.25 0 1 0 10.5 0v-1.5a.75.75 0 0 1 1.5 0v1.5a6.751 6.751 0 0 1-6 6.709v2.291h3a.75.75 0 0 1 0 1.5h-7.5a.75.75 0 0 1 0-1.5h3v-2.291a6.751 6.751 0 0 1-6-6.709v-1.5A.75.75 0 0 1 6 10.5Z" />
                </svg>
              </div>
              <div className="flex gap-1 items-end h-8">
                {[3, 6, 10, 7, 4, 8, 12, 5, 9, 6, 3, 7, 11, 4, 8].map((h, i) => (
                  <div key={i} className="w-1.5 bg-indigo-400 rounded-full opacity-70" style={{ height: h * 2 }} />
                ))}
              </div>
              <p className="text-xs text-gray-400">Говори… натисни щоб зупинити</p>
            </div>
          }
        />

        <FeatureBlock
          icon="✨"
          title="AI смарт-підказка"
          description="Персональна рекомендація кожного дня"
          detail={[
            'Claude аналізує всі твої задачі на сьогодні',
            'Враховує пріоритет, дедлайн і час виконання',
            'Радить конкретно з якої задачі почати і чому',
            'Оновлюється кожного разу при відкритті додатку',
          ]}
          mockup={
            <div className="bg-white rounded-2xl p-3 border border-indigo-100 flex gap-3">
              <span className="text-xl">✨</span>
              <div>
                <p className="text-xs font-semibold text-indigo-500 mb-1">AI підказка</p>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Почни з дзвінка клієнту — він має найвищий пріоритет і займе лише 15 хвилин, тож ти швидко його закриєш і звільниш голову для решти задач.
                </p>
              </div>
            </div>
          }
        />

        <FeatureBlock
          icon="🗓️"
          title="Тижневий планувальник"
          description="Розподіляй задачі по днях"
          detail={[
            'Перегляд всіх задач у розрізі тижня',
            'Тап на задачу → вибір дня',
            'Бачиш скільки задач заплановано на кожен день',
            'Незаплановані задачі виділені окремо',
          ]}
          mockup={
            <div>
              <div className="flex gap-1.5 mb-3">
                {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'].map((d, i) => (
                  <div key={d} className={`flex-1 flex flex-col items-center rounded-xl py-1.5 ${i === 4 ? 'bg-gradient-to-b from-blue-600 to-violet-600' : 'bg-white border border-gray-100'}`}>
                    <span className={`text-[9px] font-medium ${i === 4 ? 'text-white/70' : 'text-gray-400'}`}>{d}</span>
                    <span className={`text-xs font-bold ${i === 4 ? 'text-white' : 'text-gray-700'}`}>{2 + i}</span>
                    {i === 4 && <span className="text-[9px] text-white/70">2</span>}
                    {i === 1 && <span className="text-[9px] text-indigo-500">1</span>}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] text-gray-400 font-semibold">Пт, 6</p>
                {['Подзвонити клієнту', 'Підготувати звіт'].map((t) => (
                  <div key={t} className="bg-white rounded-xl px-3 py-2 text-xs text-gray-700 font-medium border border-gray-100">{t}</div>
                ))}
              </div>
            </div>
          }
        />

        <FeatureBlock
          icon="📊"
          title="Прогрес і статистика"
          description="Бачиш скільки вже зроблено"
          detail={[
            'Кільцевий прогрес-індикатор на головній',
            'Кількість виконаних, активних і всіх задач',
            'Мотивує завершити день продуктивно',
            'Оновлюється в реальному часі',
          ]}
          mockup={
            <div className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100">
              <div className="relative flex-shrink-0">
                <svg width="64" height="64" viewBox="0 0 100 100" className="-rotate-90">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#e0e7ff" strokeWidth="12" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#pg)" strokeWidth="12"
                    strokeLinecap="round" strokeDasharray="175 264" />
                  <defs>
                    <linearGradient id="pg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-indigo-700 font-bold text-sm">66%</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Всього</span><span className="font-semibold text-gray-800">9</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Виконано</span><span className="font-semibold text-green-600">6</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Залишилось</span><span className="font-semibold text-indigo-600">3</span>
                </div>
              </div>
            </div>
          }
        />
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 py-12 mx-4 rounded-3xl mb-10 max-w-md md:mx-auto">
        <p className="text-xs font-semibold text-white/60 tracking-widest uppercase mb-2 text-center">Як це працює</p>
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Три кроки до продуктивності</h2>
        <div className="flex flex-col gap-6">
          <StepCard number="1" title="Capture — виклади все з голови"
            description="Введи або надиктуй все що треба зробити. Не думай про структуру — просто говори природньою мовою." />
          <div className="h-px bg-white/20" />
          <StepCard number="2" title="AI розбирає і розставляє пріоритети"
            description="Claude Opus 4.8 аналізує текст, виділяє окремі задачі, визначає терміновість, оцінює час і розпізнає дедлайни." />
          <div className="h-px bg-white/20" />
          <StepCard number="3" title="Плануй і виконуй"
            description="Розподіляй задачі по днях тижня, отримуй AI-підказку що робити першим і відмічай виконане." />
        </div>
      </div>

      {/* Tech stack */}
      <div className="px-4 pb-10 max-w-md mx-auto">
        <p className="text-xs font-semibold text-gray-400 text-center tracking-widest uppercase mb-6">Технічний стек</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'Next.js 16', desc: 'App Router, Server Components' },
            { name: 'Claude Opus 4.8', desc: 'AI парсинг та підказки' },
            { name: 'TypeScript', desc: 'Типобезпечний код' },
            { name: 'Neon Postgres', desc: 'Serverless база даних' },
            { name: 'NextAuth', desc: 'Автентифікація' },
            { name: 'Tailwind CSS', desc: 'Стилізація' },
            { name: 'Web Speech API', desc: 'Голосовий ввід' },
            { name: 'Vercel', desc: 'Деплой і хостинг' },
          ].map((tech) => (
            <div key={tech.name} className="bg-white border border-gray-100 rounded-2xl px-3 py-2.5 shadow-sm">
              <p className="text-xs font-bold text-gray-800">{tech.name}</p>
              <p className="text-[11px] text-gray-400">{tech.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-16 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Готовий спробувати?</h2>
        <p className="text-gray-400 text-sm mb-6">Безкоштовно. Реєстрація за 30 секунд.</p>
        <Link href="/auth/login"
          className="inline-block bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-base">
          Почати планувати →
        </Link>
      </div>

      <div className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-300">Planny · Побудовано з Claude API · {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}
