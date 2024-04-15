import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardIcon } from "../shared/icons";

type CopyToClipboardProps = {
  status: string | undefined;
  open: boolean;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCopy: any;
};

export function CopyToClipboard({
  status,
  open,
  onCopy,
}: CopyToClipboardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {open && status && status === "PUBLIC" && (
            <Button onClick={onCopy} variant="outline">
              Copy to Clipboard
              <ClipboardIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
