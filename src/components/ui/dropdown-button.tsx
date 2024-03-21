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
  buttonText: string;
};

const DropdownButton = ({
  icon,
  children,
  buttonText,
}: DropDownButtonProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <span className="sr-only">Manage SAFE</span>
          {icon ? icon : <RiAddFill className="mr-2 h-5 w-5" />}
          {buttonText}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { DropdownButton };
