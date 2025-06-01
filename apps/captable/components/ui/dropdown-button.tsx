import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";

type DropDownButtonProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  buttonSlot: React.ReactNode | string;
};

const DropdownButton = ({ children, buttonSlot }: DropDownButtonProps) => {
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
