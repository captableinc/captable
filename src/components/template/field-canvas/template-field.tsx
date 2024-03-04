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

import { type TypeZodAddFieldMutationSchema } from "@/trpc/routers/template-field-router/schema";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { TemplateFieldContainer } from "./template-field-container";

type Field = TypeZodAddFieldMutationSchema["data"][number];

interface TemplateFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
  id: string;
  focusId: string;
  index: number;
  handleFocus: (id: string) => void;
  handleDelete: () => void;
  viewportWidth: number;
  viewportHeight: number;
  currentViewportWidth: number;
  currentViewportHeight: number;
}

export function TemplateField({
  height,
  left,
  top,
  width,
  id,
  focusId,
  handleFocus,
  index,
  handleDelete,
  currentViewportHeight,
  currentViewportWidth,
  viewportHeight,
  viewportWidth,
}: TemplateFieldProps) {
  const { control } = useFormContext<{ fields: Field[] }>();

  return (
    <TemplateFieldContainer
      className="overflow-visible"
      viewportWidth={viewportWidth}
      viewportHeight={viewportHeight}
      currentViewportWidth={currentViewportWidth}
      currentViewportHeight={currentViewportHeight}
      width={width}
      top={top}
      left={left}
      height={height}
      onClick={() => {
        handleFocus(id);
      }}
      role="button"
      tabIndex={0}
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
            handleDelete();
          }}
        >
          X
        </Button>

        <FormField
          control={control}
          name={`fields.${index}.type`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Field type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="trigger group h-8">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
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
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name={`fields.${index}.name`}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">Field Name</FormLabel>
              <FormControl>
                <Input
                  className="h-8 min-w-16"
                  type="text"
                  required
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </TemplateFieldContainer>
  );
}
