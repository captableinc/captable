import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiCloseCircleLine } from "@remixicon/react";

import { FieldTypeData } from "../field-type-data";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { type TemplateFieldForm } from "@/providers/template-field-provider";
import { type RouterOutputs } from "@/trpc/shared";
import { useFormContext, useWatch } from "react-hook-form";
import { TemplateFieldContainer } from "./template-field-container";

type Recipients = RouterOutputs["template"]["get"]["recipients"];

interface TemplateFieldProps {
  left: number;
  top: number;
  width: number;
  height: number;
  index: number;
  handleDelete: () => void;
  viewportWidth: number;
  viewportHeight: number;
  currentViewportWidth: number;
  currentViewportHeight: number;
  recipients: Recipients;
}

export function TemplateField({
  height,
  left,
  top,
  width,
  index,
  handleDelete,
  currentViewportHeight,
  currentViewportWidth,
  viewportHeight,
  viewportWidth,
  recipients,
}: TemplateFieldProps) {
  const { control, getValues } = useFormContext<TemplateFieldForm>();
  const type = useWatch({ control: control, name: `fields.${index}.type` });
  const recipientId = useWatch({
    control: control,
    name: `fields.${index}.recipientId`,
  });

  const recipientColors = getValues("recipientColors");
  const color = recipientColors?.[recipientId] ?? "";

  return (
    <TemplateFieldContainer
      viewportWidth={viewportWidth}
      viewportHeight={viewportHeight}
      currentViewportWidth={currentViewportWidth}
      currentViewportHeight={currentViewportHeight}
      width={width}
      top={top}
      left={left}
      height={height}
      color={color}
    >
      <div className="flex items-center gap-x-2">
        <Button
          className="mt-2"
          variant="ghost"
          size="sm"
          onClick={() => {
            handleDelete();
          }}
        >
          <RiCloseCircleLine className="h-5 w-5" />
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

      <RecipientSelect recipients={recipients} index={index} />

      {type === "TEXT" && <FieldDefaultValue index={index} />}
    </TemplateFieldContainer>
  );
}

interface FieldDefaultValueProps {
  index: number;
}

function FieldDefaultValue({ index }: FieldDefaultValueProps) {
  const { control } = useFormContext<TemplateFieldForm>();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1" className="border-b-0">
        <AccordionTrigger className="text-sm">
          Additional settings
        </AccordionTrigger>

        <AccordionContent>
          <div className="flex flex-col gap-y-2">
            <FormField
              control={control}
              name={`fields.${index}.defaultValue`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Default value</FormLabel>
                  <FormControl>
                    <Input className="h-8 min-w-16" type="text" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`fields.${index}.readOnly`}
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="leading-none">
                    <FormLabel>Read only field</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

interface RecipientSelectProps {
  index: number;
  recipients: Recipients;
}

function RecipientSelect({ index, recipients }: RecipientSelectProps) {
  const { control, getValues } = useFormContext<TemplateFieldForm>();
  const recipientColors = getValues("recipientColors");
  return (
    <FormField
      control={control}
      name={`fields.${index}.recipientId`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Recipient</FormLabel>
          <Select
            required
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="h-auto px-2 py-1">
                <SelectValue />
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
                        recipientColors[recipient.id],
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
