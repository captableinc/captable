import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COLORS } from "@/constants/esign";

import { FieldTypeData } from "../field-type-data";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { TemplateFieldForm } from "@/providers/template-field-provider";
import type { RouterOutputs } from "@/trpc/shared";
import { useFormContext, useWatch } from "react-hook-form";
import { CustomFieldRenderer } from "./custom-field-renderer";
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
          className="group mt-2"
          variant="ghost"
          size="sm"
          onClick={() => {
            handleDelete();
          }}
        >
          <Icon
            name="close-circle-line"
            className="h-5 w-5 text-red-500/90 group-hover:text-red-500"
          />
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

      <CustomFieldRenderer index={index} />
    </TemplateFieldContainer>
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
                        "mr-3 rounded-full p-2",
                        COLORS[
                          recipientColors[recipient.id] as keyof typeof COLORS
                        ]?.bg,
                      )}
                    />
                    <span className="flex flex-col items-start">
                      {recipient.name && recipient.name !== "" && (
                        <span>{recipient.name}</span>
                      )}
                      <span className="text-xs text-primary/80">
                        {recipient.email}
                      </span>
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
