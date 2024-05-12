import { CaptableLogo } from '@/components/common/logo'

interface LoginFormHeaderProps {
  page?: string
}

export function AuthFormHeader({ page }: LoginFormHeaderProps) {
  return (
    <div className="flex flex-col gap-y-2 text-center">
      <CaptableLogo className="mb-3 h-10 w-auto" />
      <h1 className="mb-2 text-2xl font-semibold tracking-tight">
        {page === 'signup'
          ? 'Create your Captable, Inc. account'
          : 'Login to Captable, Inc.'}
      </h1>
    </div>
  )
}
