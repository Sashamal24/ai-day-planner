import { auth } from '@/auth'
import BottomNav from '@/components/BottomNav'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const email = session?.user?.email ?? ''
  const name = session?.user?.name ?? email.split('@')[0] ?? 'User'

  return (
    <>
      <div className="max-w-md mx-auto min-h-screen pb-20" data-email={email} data-name={name}>
        {children}
      </div>
      <BottomNav />
    </>
  )
}
