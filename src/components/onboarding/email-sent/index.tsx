'use client'

import { Button } from '@/components/ui/button'
import { RiMailLine } from '@remixicon/react'
import Link from 'next/link'

const EmailSent = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          <RiMailLine className="mb-1 h-10 w-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">Email sent!</h1>
        </div>
        <div className="text-center">
          A password reset email has been sent, if you have an account you
          should see it in your inbox shortly.
        </div>
        <Link href="/" className="mt-4 text-center">
          <Button size="lg">Back to login</Button>
        </Link>
      </div>
    </div>
  )
}
export default EmailSent
