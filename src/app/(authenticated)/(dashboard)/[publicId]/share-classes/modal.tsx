'use client'

import Modal from '@/components/common/modal'
import { type ShareClassMutationType } from '@/trpc/routers/share-class/schema'
import { useState } from 'react'
import ShareClassForm from './form'

type ShareClassType = {
  type: string
  title: string | React.ReactNode
  subtitle: string | React.ReactNode
  trigger: React.ReactNode
  shareClass?: ShareClassMutationType
  shareClasses?: ShareClassMutationType[]
}

const ShareClassModal = ({
  title,
  subtitle,
  trigger,
  shareClass,
  shareClasses = [] as ShareClassMutationType[],
  type = 'create',
}: ShareClassType) => {
  const [open, setOpen] = useState(false)

  return (
    <Modal
      size="2xl"
      title={title}
      subtitle={subtitle}
      trigger={trigger}
      dialogProps={{
        open,
        onOpenChange: (val) => {
          setOpen(val)
        },
      }}
    >
      <ShareClassForm
        type={type}
        setOpen={setOpen}
        shareClass={shareClass}
        shareClasses={shareClasses}
      />
    </Modal>
  )
}

export default ShareClassModal
