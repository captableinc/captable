import { getServerAuthSession } from '@/server/auth'
import { redirect } from 'next/navigation'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerAuthSession()

  if (!session) {
    redirect('/login')
  }
  return <>{children}</>
}
