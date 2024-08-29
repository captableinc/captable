"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import Kbd from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useControllableState } from "@/hooks/use-controllable-state";
import { cn } from "@/lib/utils";
import { RiCheckFill as CheckIcon } from "@remixicon/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";

export type ComboBoxOption = {
  value: string;
  label: string;
  icon?: React.FC<{ className: string }>;
};

export const LinearCombobox = ({
  options,
  defaultOption,
  children,
  defaultValue,
  value: value_,
  onChange,
}: {
  options: ComboBoxOption[];
  defaultOption?: ComboBoxOption;
  children?: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onChange?(val: string): void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useControllableState({
    defaultProp: defaultValue,
    prop: value_,
    onChange,
  });

  const [searchValue, setSearchValue] = useState("");

  const selectedOption = options.find((item) => item.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          role="combobox"
          aria-expanded={open}
          aria-label="Select option"
          variant="outline"
          size="lg"
          className="w-full px-3 h-10 text-[0.8125rem] leading-normal font-medium text-primary text-left items-center justify-start"
        >
          {selectedOption ? (
            <>
              {selectedOption.icon && (
                <selectedOption.icon
                  className={cn("mr-2 size-4 fill-primary")}
                  aria-hidden="true"
                />
              )}
              {selectedOption.label}
            </>
          ) : defaultOption ? (
            <>{defaultOption.label}</>
          ) : (
            <>Select an Option</>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[206px] p-0 rounded-lg"
        align="start"
        sideOffset={6}
      >
        <Command className="rounded-lg relative">
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              if (Number.parseInt(value) < options.length) {
                const possibleOption = options[Number.parseInt(value)];
                if (possibleOption) {
                  setValue(possibleOption.value);
                  setOpen(false);
                  setSearchValue("");
                  return;
                }
              }
              setSearchValue(value);
            }}
            className="text-[0.8125rem] leading-normal"
            placeholder="Search or type option #"
          />

          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(value) => {
                    setValue(value);
                    setOpen(false);
                    setSearchValue("");
                  }}
                  className="group rounded-md flex justify-between items-center w-full text-[0.8125rem] leading-normal text-primary"
                >
                  <div className="flex items-center gap-x-2">
                    <div className="min-w-3 text-center">
                      <Kbd className="mr-3">{index}</Kbd>
                    </div>
                    <div className="flex items-center">
                      {option.icon && (
                        <option.icon className="mr-2 size-4 fill-muted-foreground group-hover:fill-primary" />
                      )}
                      <span>{option.label}</span>
                    </div>
                  </div>

                  <div>
                    {selectedOption?.value === option.value && (
                      <CheckIcon className="mr-3 size-4 fill-muted-foreground group-hover:fill-primary" />
                    )}
                  </div>
                </CommandItem>
              ))}
              {children && (
                <>
                  <CommandSeparator />
                  <CommandItem>{children}</CommandItem>
                </>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
