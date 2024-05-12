import { LogoIcon } from '@/components/common/icons'

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/50">
      <div className="flex h-screen items-center justify-center">
        <div className="relative inline-flex">
          <LogoIcon className="h-8 w-8 animate-pulse" />
          <div className="absolute left-0 top-0 h-8 w-8 animate-ping rounded-full bg-primary"></div>
        </div>
      </div>
    </div>
  )
}

export default Loading
