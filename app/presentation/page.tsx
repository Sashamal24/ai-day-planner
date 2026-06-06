import Link from 'next/link'

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold text-gray-900 mb-1 text-base">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
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
            <span className="text-white/90 text-xs font-semibold tracking-wide uppercase">AI-powered</span>
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Planny
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-sm mx-auto leading-relaxed">
            Розмовляй з додатком як з асистентом — він сам розбере твої задачі, розставить пріоритети і скаже з чого почати
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-white text-indigo-600 font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-base"
          >
            Спробувати безкоштовно →
          </Link>
        </div>
      </div>

      {/* Phone mockup strip */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 pb-8">
        <div className="max-w-sm mx-auto bg-white/10 backdrop-blur rounded-3xl p-4 border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="bg-white rounded-2xl p-4 text-left">
            <p className="text-xs text-gray-400 mb-1">Capture — що в голові?</p>
            <div className="bg-gray-50 rounded-xl p-3 text-sm text-gray-600 italic mb-3">
              "Подзвонити клієнту терміново, купити продукти до п'ятниці, підготувати звіт на 2 години"
            </div>
            <div className="flex items-center gap-2 justify-center py-1">
              <div className="w-4 h-px bg-gray-200 flex-1" />
              <span className="text-xs text-indigo-500 font-medium">✨ AI аналізує…</span>
              <div className="w-4 h-px bg-gray-200 flex-1" />
            </div>
            <div className="flex flex-col gap-2 mt-3">
              {[
                { title: 'Подзвонити клієнту', p: 'Високий', c: 'bg-red-100 text-red-700', t: '15 хв' },
                { title: 'Підготувати звіт', p: 'Середній', c: 'bg-yellow-100 text-yellow-700', t: '2 год' },
                { title: 'Купити продукти', p: 'Низький', c: 'bg-green-100 text-green-700', t: null },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                  <span className="text-xs text-gray-800 font-medium">{item.title}</span>
                  <div className="flex items-center gap-1.5">
                    {item.t && <span className="text-[10px] text-gray-400">{item.t}</span>}
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${item.c}`}>{item.p}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-12 max-w-md mx-auto">
        <p className="text-xs font-semibold text-indigo-500 text-center tracking-widest uppercase mb-2">Можливості</p>
        <h2 className="text-2xl font-extrabold text-gray-900 text-center mb-8">
          Все що потрібно для продуктивного дня
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <FeatureCard
            icon="🎙️"
            title="Голосовий ввід"
            description="Диктуй задачі голосом — швидше ніж друкувати"
          />
          <FeatureCard
            icon="🤖"
            title="AI-парсинг"
            description="Одним текстом описуєш день — AI розбиває на задачі"
          />
          <FeatureCard
            icon="⚡"
            title="Пріоритети"
            description="Claude автоматично визначає що важливо і термінове"
          />
          <FeatureCard
            icon="📅"
            title="Дедлайни"
            description="AI розпізнає дати прямо з тексту і прив'язує до задач"
          />
          <FeatureCard
            icon="✨"
            title="Смарт-підказки"
            description="Щодня AI радить з якої задачі почати і чому"
          />
          <FeatureCard
            icon="🗓️"
            title="Тижневий план"
            description="Розподіляй задачі по днях тижня одним тапом"
          />
        </div>
      </div>

      {/* How it works */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 px-6 py-12 mx-4 rounded-3xl mb-12 max-w-md md:mx-auto">
        <p className="text-xs font-semibold text-white/60 tracking-widest uppercase mb-2 text-center">Як це працює</p>
        <h2 className="text-2xl font-extrabold text-white text-center mb-8">Три кроки до продуктивності</h2>
        <div className="flex flex-col gap-6">
          <StepCard
            number="1"
            title="Capture — виклади все з голови"
            description="Введи або надиктуй все що треба зробити. Не думай про структуру — просто говори."
          />
          <div className="h-px bg-white/20" />
          <StepCard
            number="2"
            title="AI розбирає і розставляє пріоритети"
            description="Claude аналізує текст, виділяє окремі задачі, визначає терміновість і оцінює час виконання."
          />
          <div className="h-px bg-white/20" />
          <StepCard
            number="3"
            title="Плануй і виконуй"
            description="Розподіляй задачі по днях тижня, отримуй AI-підказку що робити першим і відмічай виконане."
          />
        </div>
      </div>

      {/* Tech stack */}
      <div className="px-4 pb-12 max-w-md mx-auto">
        <p className="text-xs font-semibold text-gray-400 text-center tracking-widest uppercase mb-6">Технічний стек</p>
        <div className="flex flex-wrap justify-center gap-2">
          {['Next.js 14', 'TypeScript', 'Claude Opus 4.8', 'Neon Postgres', 'NextAuth', 'Tailwind CSS', 'Web Speech API', 'Vercel'].map((tech) => (
            <span key={tech} className="bg-white border border-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-16 max-w-md mx-auto text-center">
        <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Готовий спробувати?</h2>
        <p className="text-gray-400 text-sm mb-6">Безкоштовно. Без кредитної картки.</p>
        <Link
          href="/auth/login"
          className="inline-block bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all active:scale-95 text-base"
        >
          Почати планувати →
        </Link>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 py-6 text-center">
        <p className="text-xs text-gray-300">Planny · Побудовано з Claude API · {new Date().getFullYear()}</p>
      </div>

    </div>
  )
}
