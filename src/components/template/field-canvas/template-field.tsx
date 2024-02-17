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

import { FieldTypeData } from "../field-type-data";
import { useFieldCanvasContext } from "@/contexts/field-canvas-context";

interface TemplateFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
  name: string;
  focusId: string;
  type: string;

  handleFocus: (id: string) => void;
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
  type,
}: TemplateFieldProps) {
  const { handleDeleteField } = useFieldCanvasContext();

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
            handleDeleteField(id);
          }}
        >
          X
        </Button>

        <div className="flex">
          <Select defaultValue={type}>
            <SelectTrigger className="trigger group h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FieldTypeData.map((item) => (
                <SelectItem key={item.label} value={item.value}>
                  <span className="flex items-center gap-x-2">
                    <item.icon className="h-4 w-4" aria-hidden />
                    <span className="group-[.trigger]:hidden">
                      {item.label}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input type="text" defaultValue={name} className="h-8 min-w-16" />
      </div>
    </button>
  );
}
