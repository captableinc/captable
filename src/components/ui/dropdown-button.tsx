import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Button } from '@/components/ui/button'
import { RiAddFill } from '@remixicon/react'

type DropDownButtonProps = {
  icon?: React.ReactNode
  children: React.ReactNode
  buttonSlot: React.ReactNode | string
}

const DropdownButton = ({
  icon,
  children,
  buttonSlot,
}: DropDownButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{buttonSlot}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { DropdownButton }
