'use client'

import Modal from '@/components/common/modal'
import { type EquityPlanMutationType } from '@/trpc/routers/equity-plan/schema'
import { type ShareClassMutationType } from '@/trpc/routers/share-class/schema'
import { useState } from 'react'
import EquityPlanForm from './form'

type EquityPlanType = {
  type: string
  title: string | React.ReactNode
  subtitle: string | React.ReactNode
  trigger: React.ReactNode
  equityPlan?: EquityPlanMutationType
  shareClasses: ShareClassMutationType[]
}

const EquityPlanModal = ({
  title,
  subtitle,
  trigger,
  equityPlan,
  shareClasses,
  type = 'create',
}: EquityPlanType) => {
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
      <EquityPlanForm
        type={type}
        setOpen={setOpen}
        equityPlan={equityPlan}
        shareClasses={shareClasses}
      />
    </Modal>
  )
}

export default EquityPlanModal
