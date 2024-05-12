'use client'

import { Button } from '@/components/ui/button'
import { api } from '@/trpc/react'
import {
  RiArrowRightLine,
  RiMailCheckLine,
  RiMailCloseLine,
} from '@remixicon/react'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

const VerifyEmail = ({ token }: { token: string }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')

  const { mutateAsync } = api.auth.verifyEmail.useMutation({
    onSuccess: async ({ message }) => {
      setLoading(false)
      setSuccess(message)
    },
    onError: (error) => {
      setLoading(false)
      setError(error.message)
    },
  })

  const onSubmit = useCallback(async () => {
    if (success || error) return

    if (!token) {
      setLoading(false)
      setError('Missing token!')
      return
    }

    try {
      await mutateAsync(token)
    } catch (err) {
      console.error(err)
      setLoading(false)
      setError('Something went wrong! Please try again.')
    }
  }, [token, success, error])

  useEffect(() => {
    void onSubmit()
  }, [onSubmit])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
        <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
          <div className="flex flex-col gap-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Verifying...
            </h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <div className="flex flex-col gap-y-2 text-center">
          {success ? (
            <>
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-100">
                <span className="text-teal-500">
                  <RiMailCheckLine className="h-6 w-auto" />
                </span>
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {success}
              </h1>
              <div className="mb-2 text-center text-sm text-muted-foreground">
                Your account has been verified. Please login to continue.
              </div>
            </>
          ) : (
            <>
              <RiMailCloseLine className="mb-1 h-10 w-auto" />
              <h1 className="text-2xl font-semibold tracking-tight">
                Verification Failed
              </h1>
              <div className="mb-2 text-center text-sm text-muted-foreground">
                {error}
              </div>
            </>
          )}

          {success ? (
            <Link href="/signin" className="mt-4">
              <Button size="lg">
                Continue to Login page
                <RiArrowRightLine className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link href="/signup" className="mt-4">
              <Button size="lg">
                Try signing up again
                <RiArrowRightLine className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default VerifyEmail
