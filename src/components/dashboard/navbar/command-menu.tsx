'use client'

import {
  RiAccountCircleFill,
  RiPieChart2Fill,
  RiSparklingFill,
  RiUploadCloud2Fill,
} from '@remixicon/react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RiSearchLine } from '@remixicon/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Pages = [
  {
    id: 'ai',
    title: 'Ask an AI',
    path: '/ai',
    icon: RiSparklingFill,
  },
  {
    id: 'stakeholders',
    title: 'Add Stakeholder',
    path: '/stakeholders',
    icon: RiAccountCircleFill,
  },
  {
    id: 'documents',
    title: 'Upload document',
    path: '/documents',
    icon: RiUploadCloud2Fill,
  },
  {
    id: 'captable',
    title: 'Create an equity plan',
    path: '/captable',
    icon: RiPieChart2Fill,
  },
  {
    id: 'securities',
    title: 'Create a share class',
    path: '/securities',
    icon: RiPieChart2Fill,
  },
  {
    id: 'safe',
    title: 'Create a SAFE',
    path: '/safe',
    icon: RiPieChart2Fill,
  },
]

export function CommandMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const push = (path: string) => {
    router.push(path)
    setOpen(false)
  }

  return (
    <div className={cn('ml-8 hidden flex-1 gap-x-6 md:flex md:justify-center')}>
      <Button
        variant="outline"
        className="flex w-80 items-center justify-between rounded text-muted-foreground"
        onClick={() => setOpen((s) => !s)}
      >
        <div className="flex items-center">
          <RiSearchLine className="mr-2 h-5 w-5" />
          <span>Type a command or search</span>
        </div>
        <p className="text-sm text-muted-foreground">
          {' '}
          <kbd className="pointer-events-none mr-1.5 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1 font-mono shadow">
            ⌘
          </kbd>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1 font-mono text-xs shadow">
            K
          </kbd>
        </p>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="no-scrollbar">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {Pages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => push(page.path)}
                className=""
              >
                <div
                  className={cn(
                    'rounded-lg p-0.5',
                    page.id === 'ai' ? 'bg-teal-100' : 'bg-gray-200',
                  )}
                >
                  {page.id === 'ai' ? (
                    <page.icon
                      className="h-4 w-4 p-0.5 text-teal-600"
                      aria-hidden="true"
                    />
                  ) : (
                    <page.icon
                      className="h-4 w-4 p-0.5 text-primary"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <span className="ml-2">{page.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
