import { VerifyMemberForm } from '@/components/member/verify-member-form'
import { withServerSession } from '@/server/auth'
import { checkVerificationToken } from '@/server/member'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify member',
}

export default async function VerifyMember({
  params: { token },
}: {
  params: { token: string }
}) {
  const session = await withServerSession()

  const { memberId } = await checkVerificationToken(token, session.user.email)

  return <VerifyMemberForm memberId={memberId} token={token} />
}
