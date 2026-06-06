import { auth } from '@/auth'
import BottomNav from '@/components/BottomNav'
import AppHeader from '@/components/AppHeader'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <>
      <AppHeader email={session?.user?.email ?? ''} />
      <div className="max-w-md mx-auto min-h-screen pt-14 pb-16">
        {children}
      </div>
      <BottomNav />
    </>
  )
}
