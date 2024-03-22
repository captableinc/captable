import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { RiAddFill } from "@remixicon/react";
import { Button } from "@/components/ui/button";

type DropDownButtonProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  buttonSlot: React.ReactNode | string;
};

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
  );
};

export { DropdownButton };
