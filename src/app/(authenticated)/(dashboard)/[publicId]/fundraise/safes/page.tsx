import EmptyState from '@/components/common/empty-state'
import SafeActions from '@/components/safe/actions'
import { withServerSession } from '@/server/auth'
import { RiSafeFill } from '@remixicon/react'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SAFEs',
}

import SafeTable from '@/components/safe/existing/safe-table'
import { Card } from '@/components/ui/card'
import { api } from '@/trpc/server'

const SafePage = async () => {
  const safes = await api.safe.getSafes.query()
  const session = await withServerSession()
  const user = session.user

  if (safes?.data?.length === 0) {
    return (
      <EmptyState
        icon={<RiSafeFill />}
        title="Create and manage SAFE agreements."
        subtitle="Please click the button for creating agreements."
      >
        <SafeActions companyPublicId={user.companyPublicId} />
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">SAFEs</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage SAFE agreements for your company.
          </p>
        </div>
        <div>
          <SafeActions companyPublicId={user.companyPublicId} />
        </div>
      </div>
      <Card className="mx-auto mt-3 w-[28rem] sm:w-[38rem] md:w-full">
        <SafeTable safes={safes.data} />
      </Card>
    </div>
  )
}

export default SafePage
