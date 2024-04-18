"use client";

import { Button } from "@/components/ui/button";
import { type FieldTypes } from "@/prisma/enums";
import * as Toolbar from "@radix-ui/react-toolbar";
import { FieldTypeData } from "../field-type-data";

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
import { type TemplateFieldForm } from "@/providers/template-field-provider";
import { type RouterOutputs } from "@/trpc/shared";
import { useFormContext, useFormState } from "react-hook-form";
import { ALL_RECIPIENT_VALUE } from "@/constants/esign";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

interface CanvasToolbarProps {
  recipients: Recipients;
}

export function CanvasToolbar({ recipients }: CanvasToolbarProps) {
  const { control } = useFormContext<TemplateFieldForm>();
  const { isDirty } = useFormState({
    control,
    name: "fields",
  });

  const isDisabled = !isDirty;

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
          <FormField
            name="recipient"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">Recipient</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Recipient" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {recipients.map((recipient) => (
                      <SelectItem key={recipient.id} value={recipient.id}>
                        {recipient.email}
                      </SelectItem>
                    ))}
                    <SelectItem value={ALL_RECIPIENT_VALUE}>
                      All recipients
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Toolbar.Button asChild>
            <Button disabled={isDisabled} type="submit">
              Save
            </Button>
          </Toolbar.Button>
        </div>
      </Toolbar.Root>
    </div>
  );
}
