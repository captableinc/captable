import { AuditTable } from '@/components/audit/audit-table'
import { Card } from '@/components/ui/card'
import { api } from '@/trpc/server'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audits',
}

const AuditsPage = async () => {
  const audits = await api.audit.getAudits.query({})
  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between gap-y-3 ">
        <div className="gap-y-3">
          <h3 className="font-medium">Audits</h3>
          <p className="text-sm text-muted-foreground">
            Manage your company{`'`}s audits
          </p>
        </div>
      </div>
      <Card className="mt-3">
        <AuditTable audits={audits.data} />
      </Card>
    </div>
  )
}

export default AuditsPage
