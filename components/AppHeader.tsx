'use client'

import { signOut } from 'next-auth/react'

export default function AppHeader({ email }: { email: string }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-md mx-auto flex items-center justify-between px-4 h-14">
        <span className="text-sm text-gray-400 truncate max-w-[200px]">{email}</span>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors font-medium"
        >
          Вийти
        </button>
      </div>
    </header>
  )
}
