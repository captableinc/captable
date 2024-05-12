'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { useToast } from '@/components/ui/use-toast'
import { ZCurrentPasswordSchema } from '@/trpc/routers/auth/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { RiGoogleFill } from '@remixicon/react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { AuthFormHeader } from '../auth-form-header'

const loginSchema = z.object({
  email: z.string().email(),
  password: ZCurrentPasswordSchema,
})

interface LoginFormProps {
  isGoogleAuthEnabled: boolean
}

const SignInForm = ({ isGoogleAuthEnabled }: LoginFormProps) => {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: process.env.NODE_ENV === 'development' ? 'ceo@example.com' : '',
      password: process.env.NODE_ENV === 'development' ? 'P@ssw0rd!' : '',
    },
  })

  const { toast } = useToast()

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    const email = values.email
    const password = values.password
    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/onboarding',
    })

    if (result?.error) {
      toast({
        variant: 'destructive',
        title: 'Unable to login',
        description: 'Incorrect email or password',
      })
    }
  }

  async function signInWithGoogle() {
    await signIn('google', { callbackUrl: '/onboarding' })
  }
  const isSubmitting = form.formState.isSubmitting

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-100">
      <div className="grid w-full max-w-md grid-cols-1 gap-5 rounded-xl border bg-white p-10 shadow">
        <AuthFormHeader page="signin" />
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-1">
                        <FormLabel className="sr-only" htmlFor="email">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="work@email.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            autoFocus
                            required
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-light" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid gap-1">
                        <FormLabel className="sr-only" htmlFor="password">
                          Password
                        </FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="*******"
                            autoCapitalize="none"
                            autoComplete="password"
                            autoCorrect="off"
                            autoFocus
                            required
                            disabled={isSubmitting}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-light" />
                      </div>
                    </FormItem>
                  )}
                />
                <Link
                  href="/forgot-password"
                  className="text-right text-sm font-medium hover:text-gray-500"
                >
                  Forgot your password?
                </Link>
                <Button
                  loading={isSubmitting}
                  loadingText="Signing in..."
                  type="submit"
                >
                  Login with Email
                </Button>
              </div>
            </form>
          </Form>

          {isGoogleAuthEnabled && (
            <>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t"></span>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or
                  </span>
                </div>
              </div>

              <Button
                disabled={isSubmitting}
                variant="outline"
                type="button"
                onClick={signInWithGoogle}
              >
                <RiGoogleFill className="mr-2 h-4 w-4" />
                Login with Google
              </Button>
            </>
          )}
          <span className="text-center text-sm text-gray-500">
            Don{`'`}t have an account?{' '}
            <Link
              href="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Signup
            </Link>
          </span>
        </>
      </div>
    </div>
  )
}

export default SignInForm
