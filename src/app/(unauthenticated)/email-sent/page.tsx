import EmailSent from '@/components/onboarding/email-sent'

import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Email Sent',
}
export default function EmailSentPage() {
  return <EmailSent />
}
