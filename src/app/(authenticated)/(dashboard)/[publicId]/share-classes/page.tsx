import EmptyState from '@/components/common/empty-state'
import Tldr from '@/components/common/tldr'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { withServerSession } from '@/server/auth'
import { db } from '@/server/db'
import { type ShareClassMutationType } from '@/trpc/routers/share-class/schema'
import { RiAddFill, RiPieChart2Line } from '@remixicon/react'
import { type Metadata } from 'next'
import ShareClassModal from './modal'
import ShareClassTable from './table'

export const metadata: Metadata = {
  title: 'Share classes',
}

const getShareClasses = async (companyId: string) => {
  return await db.shareClass.findMany({
    where: { companyId },
  })
}

const SharesPage = async () => {
  const session = await withServerSession()
  const companyId = session?.user?.companyId
  let shareClasses: ShareClassMutationType[] = []

  if (companyId) {
    shareClasses = (await getShareClasses(
      companyId,
    )) as unknown as ShareClassMutationType[]
  }

  if (shareClasses.length === 0) {
    return (
      <EmptyState
        icon={<RiPieChart2Line />}
        title="You do not have any share classes!"
        subtitle="Please click the button below to create a new share class."
      >
        <ShareClassModal
          type="create"
          title="Create a share class"
          subtitle={
            <Tldr
              message="A share class on a cap table represents a distinct category of shares with specific rights and characteristics, such as voting preferences or priorities. Eg. Common and Preferred shares, Class A, B, etc, ESOs and RSUs, etc."
              cta={{
                label: 'Learn more',
                // TODO - this link should be updated to the correct URL
                href: 'https://captable.inc/help',
              }}
            />
          }
          trigger={
            <Button size="lg">
              <RiAddFill className="mr-2 h-5 w-5" />
              Create a share class
            </Button>
          }
        />
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Share classes</h3>
          <p className="text-sm text-muted-foreground">
            Manage your company{`'`}s share classes
          </p>
        </div>

        <div>
          <ShareClassModal
            type="create"
            title="Create a share class"
            shareClasses={shareClasses}
            subtitle={
              <Tldr
                message="A share class on a cap table represents a distinct category of shares with specific rights and characteristics, such as voting preferences or priorities. Eg. Common and Preferred shares, Class A, B, etc, ESOs and RSUs, etc."
                cta={{
                  label: 'Learn more',
                  // TODO - this link should be updated to the correct URL
                  href: 'https://captable.inc/help',
                }}
              />
            }
            trigger={
              <Button>
                <RiAddFill className="mr-2 h-5 w-5" />
                Create a share class
              </Button>
            }
          />
        </div>
      </div>

      <Card className="mt-3">
        <div className="p-6">
          <ShareClassTable shareClasses={shareClasses} />
        </div>
      </Card>
    </div>
  )
}

export default SharesPage
