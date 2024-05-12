'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { cn } from '@/lib/utils'

type DonutSelectorProps = {
  selected: string
  onChange: (value: string) => void
  className?: string
}

const DonutSelector: React.FC<DonutSelectorProps> = ({
  selected,
  onChange,
  className,
}) => {
  return (
    <Select
      value={selected}
      onValueChange={async (newValue) => {
        if (newValue !== selected) {
          onChange(newValue)
        }
      }}
    >
      <SelectTrigger
        className={cn(
          'text-normal -ml-2 h-5 w-[133px] cursor-pointer rounded border-none bg-transparent font-semibold text-primary underline',
          className,
        )}
      >
        <SelectValue placeholder="Select the type" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="share-class">Share classes</SelectItem>
        <SelectItem value="stakeholder">Stakeholders</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default DonutSelector
