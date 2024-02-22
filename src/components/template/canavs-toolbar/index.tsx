"use client";

import { Button } from "@/components/ui/button";
import * as Toolbar from "@radix-ui/react-toolbar";
import { type FieldTypes } from "@/prisma-enums";
import { useFieldCanvasContext } from "@/contexts/field-canvas-context";
import { FieldTypeData } from "../field-type-data";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";

interface CanvasToolbarProps {
  templatePublicId: string;
}

export function CanvasToolbar({ templatePublicId }: CanvasToolbarProps) {
  const { toast } = useToast();
  const { handleFieldType, fieldType, fields } = useFieldCanvasContext();
  const { mutateAsync } = api.templateField.add.useMutation({
    onSuccess: () => {
      toast({
        variant: "default",
        title: "🎉 Successfully created",
        description: "Your template fields has been created.",
      });
    },
  });

  const handleSave = async () => {
    await mutateAsync({ templatePublicId, data: fields });
  };

  return (
    <div className="relative z-30 col-span-12 mb-20">
      <Toolbar.Root
        className="fixed flex w-full max-w-[74.4%] items-center justify-between rounded-md bg-white p-2 shadow-sm"
        aria-label="Formatting options"
      >
        <Toolbar.ToggleGroup
          onValueChange={(value) => {
            handleFieldType(value as FieldTypes);
          }}
          value={fieldType}
          className="flex gap-x-2"
          type="single"
        >
          {FieldTypeData.map((item) => (
            <Toolbar.ToggleItem key={item.value} value={item.value} asChild>
              <Button
                aria-label={item.label}
                className="flex h-auto flex-col gap-y-1 data-[state=on]:bg-accent"
                variant="ghost"
              >
                <span>
                  <item.icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-xs">{item.label}</span>
              </Button>
            </Toolbar.ToggleItem>
          ))}
        </Toolbar.ToggleGroup>

        <Toolbar.Button asChild>
          <Button disabled={!fields.length} onClick={handleSave}>
            Save
          </Button>
        </Toolbar.Button>
      </Toolbar.Root>
    </div>
  );
}
