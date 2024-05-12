import VerifyEmail from '@/components/onboarding/verify-email'
import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Verify Email',
}

export type PageProps = {
  params: {
    token: string
  }
}

export default async function VerifyEmailPage({
  params: { token },
}: PageProps) {
  return <VerifyEmail token={token} />
}
