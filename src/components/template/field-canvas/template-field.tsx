import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { RiSketching, RiText } from "@remixicon/react";

interface TemplateFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
  name: string;
  focusId: string;

  handleFocus: (id: string) => void;
  handleDelete: (id: string) => void;
}

export function TemplateField({
  height,
  left,
  top,
  width,
  id,
  name,
  focusId,
  handleFocus,
  handleDelete,
}: TemplateFieldProps) {
  return (
    <button
      className="group absolute z-20 cursor-pointer overflow-visible border-2 border-red-600 bg-red-300/50"
      style={{
        left,
        top,
        width,
        height,
      }}
      onClick={() => {
        handleFocus(id);
      }}
    >
      <div
        style={{ bottom: height }}
        className={cn(
          "absolute items-center gap-x-2 border bg-white px-2 py-1",
          focusId === id ? "flex" : " hidden",
        )}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            handleDelete(id);
          }}
        >
          X
        </Button>

        <div className="flex">
          <Select defaultValue="text">
            <SelectTrigger className="trigger group h-8">
              <SelectValue defaultValue="text" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">
                <span className="flex items-center gap-x-2">
                  <RiText className="h-4 w-4" aria-hidden />
                  <span className="group-[.trigger]:hidden">Text</span>
                </span>
              </SelectItem>
              <SelectItem value="signature">
                <span className="flex items-center gap-x-2">
                  <RiSketching className="h-4 w-4" aria-hidden />
                  <span className="group-[.trigger]:hidden">Signature</span>
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input type="text" defaultValue={name} className="h-8 min-w-16" />
      </div>
    </button>
  );
}
