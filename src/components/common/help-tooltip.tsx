import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { RiQuestionLine as HelpIcon } from "@remixicon/react";

type HelpTooltipProps = {
  className?: string;
  text: string;
};

const HelpTooltip = ({ text, className }: HelpTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <HelpIcon
            className={cn(className, "w-4 h-4 text-muted-foreground")}
          />
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HelpTooltip;
