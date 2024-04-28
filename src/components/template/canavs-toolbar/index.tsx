"use client";

import { Button } from "@/components/ui/button";
import { COLORS } from "@/constants/esign";
import { type FieldTypes } from "@/prisma/enums";
import * as Toolbar from "@radix-ui/react-toolbar";
import { FieldTypeData } from "../field-type-data";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type TemplateFieldForm } from "@/providers/template-field-provider";
import { type RouterOutputs } from "@/trpc/shared";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

interface RecipientListProps {
  recipients: Recipients;
}

function RecipientList({ recipients }: RecipientListProps) {
  const { control, getValues } = useFormContext<TemplateFieldForm>();

  const recipientColors = getValues("recipientColors");

  return (
    <FormField
      name="recipient"
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="sr-only">Recipient</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="h-auto px-2 py-1 ">
                <SelectValue placeholder="Select Recipient" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {recipients.map((recipient) => (
                <SelectItem key={recipient.id} value={recipient.id}>
                  <span className="flex items-center">
                    <span
                      aria-hidden
                      className={cn(
                        "mr-2  rounded-full p-2",
                        COLORS[
                          recipientColors[recipient.id] as keyof typeof COLORS
                        ]?.bg,
                      )}
                    />
                    <span className="flex flex-col items-start">
                      {recipient.name && recipient.name !== "" && (
                        <span>{recipient.name}</span>
                      )}
                      <span>{recipient.email}</span>
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

interface CanvasToolbarProps {
  recipients: Recipients;
}
export function CanvasToolbar({ recipients }: CanvasToolbarProps) {
  const { control, setValue } = useFormContext<TemplateFieldForm>();
  const submitRef = useRef<HTMLButtonElement>(null);

  const handleDraft = () => {
    if (submitRef.current) {
      setValue("status", "DRAFT");
      submitRef.current.click();
    }
  };

  const handleComplete = () => {
    if (submitRef.current) {
      setValue("status", "COMPLETE");
      submitRef.current.click();
    }
  };

  return (
    <div className="sticky inset-x-0 top-14 z-30 col-span-12 mt-5 ">
      <Toolbar.Root
        className="flex w-full items-center justify-between rounded bg-white/50 p-2 shadow backdrop-blur-lg"
        aria-label="Formatting options"
      >
        <FormField
          name="fieldType"
          control={control}
          render={({ field }) => (
            <Toolbar.ToggleGroup
              onValueChange={(value) => {
                field.onChange(value as FieldTypes);
              }}
              value={field.value}
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
          )}
        />

        <div className="flex items-end gap-x-2">
          <RecipientList recipients={recipients} />

          <DropdownMenu>
            <Toolbar.Button asChild>
              <DropdownMenuTrigger asChild>
                <Button>Save & Continue</Button>
              </DropdownMenuTrigger>
            </Toolbar.Button>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleDraft}>
                Save as draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleComplete}>
                Send for signatures
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button aria-hidden ref={submitRef} type="submit" hidden>
            submit
          </button>
        </div>
      </Toolbar.Root>
    </div>
  );
}
