"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COLORS } from "@/constants/esign";
import { cn } from "@/lib/utils";
import { RiDeleteBinLine } from "@remixicon/react";
import React, { Fragment, useEffect, useMemo } from "react";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { UserAvatarIcon } from "../common/icons";

export type Recipient = {
  recipientId: string;
  name: string;
  email: string;
};
type OnSave = Recipient;
type OnDelete = Omit<Recipient, "name">;

type TRecipientManager =
  | {
      type: "create";
      name: string;
      defaulField: Recipient;
      existingRecipients?: never;
      onSave?: never;
      onDelete?: never;
    }
  | {
      type: "update";
      name: string;
      defaulField?: never;
      existingRecipients: Recipient[] | [];
      onSave: (data: OnSave) => void;
      onDelete: (data: OnDelete) => void;
    };

export const RecipientsManager = ({
  type,
  name,
  defaulField,
  onSave,
  onDelete,
  existingRecipients,
}: TRecipientManager) => {
  const [_existingRecipients, setExistingRecipients] = useState<
    Recipient[] | []
  >(existingRecipients ?? []);

  const form = useFormContext();
  const { append, fields, remove, replace } = useFieldArray({
    control: form.control,
    name,
  });

  const isUpdate = type === "update";
  const isDeleteDisabled = fields.length === 1;

  useEffect(() => {
    if (existingRecipients?.length) {
      setExistingRecipients(existingRecipients);
    }
  }, [existingRecipients]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <No issue here>
  const recipientColors = useMemo(() => {
    return (
      isUpdate &&
      existingRecipients.reduce<Record<string, string>>((prev, curr, index) => {
        const color = Object.keys(COLORS)?.[index] ?? "";
        prev[curr.recipientId] = color;
        return prev;
      }, {})
    );
  }, [existingRecipients]);

  const handleSave = async (index: number) => {
    const recipients = form.getValues(name) as Recipient[];
    const target = recipients[index] as Recipient;
    if (onSave) {
      if (target && !target.email) {
        toast.error("Email must be present");
        return;
      }
      await onSave({
        recipientId: target.recipientId,
        name: target.name,
        email: target.email,
      });

      replace(defaulField);
    }
  };

  return (
    <div className="pb-4">
      <div className="">
        {/* Add recipients handling */}
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col">
            {fields.map((field, index) => (
              <div
                className="my-3 flex items-end space-x-3 gap-x-2"
                key={field.id}
              >
                <div className="flex items-center gap-x-10">
                  <FormField
                    control={form.control}
                    name={`recipients.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            className="h-8 min-w-16"
                            type="text"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`recipients.${index}.email`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input className="h-8 min-w-16" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex items-center space-x-5">
                    {isUpdate && (
                      <Button
                        type="submit"
                        size="sm"
                        onClick={() => handleSave(index)}
                      >
                        Save
                      </Button>
                    )}

                    {fields.length > 1 && (
                      <Button
                        disabled={isDeleteDisabled}
                        onClick={() => remove(index)}
                        variant="ghost"
                        size="sm"
                        className="group h-8 w-8 p-2"
                      >
                        <RiDeleteBinLine
                          aria-hidden
                          className="h-8 w-8 text-red-500/70 group-hover:text-red-500"
                        />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center my-2">
          {!isUpdate && (
            <div>
              <Button
                type="button"
                variant={"outline"}
                size="sm"
                onClick={() => {
                  append(defaulField);
                }}
              >
                Add more recipient
              </Button>
            </div>
          )}
        </div>

        {/* Render existing recipients */}
        <section>
          {type === "update" && (
            <Fragment>
              <p className="text-gray-500 font-bold my-1 w-full">
                Existing recipients
              </p>
              <div className="grid grid-cols-2 gap-x-1 bg-gray-100 p-1 mb-2 max-h-32 overflow-auto">
                {_existingRecipients.map(({ recipientId, name, email }) => (
                  <div
                    key={recipientId}
                    className="flex pr-2 items-center justify-between py-2 w-64"
                  >
                    <div className="flex pr-2 items-center space-x-3">
                      <div>
                        <UserAvatarIcon className="h-9 w-9" />
                      </div>

                      <div className="flex flex-col">
                        <p className="flex items-center space-x-2">
                          <span className="text-sm italic">{name}</span>
                          <span
                            aria-hidden
                            className={cn(
                              "mr-2  rounded-full p-1",
                              COLORS[
                                //@ts-ignore
                                recipientColors[
                                  recipientId
                                ] as keyof typeof COLORS
                              ]?.bg,
                            )}
                          />
                        </p>
                        <span className="text-sm italic">{email}</span>
                      </div>
                    </div>

                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-red-100 hover:cursor-pointer ml-auto group h-8 w-8 p-2"
                      >
                        <RiDeleteBinLine
                          onClick={() => {
                            onDelete({
                              recipientId,
                              email,
                            });
                          }}
                          aria-hidden
                          className="h-8 w-8 text-red-500/70 group-hover:text-red-500"
                        />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Fragment>
          )}
        </section>
      </div>
    </div>
  );
};
