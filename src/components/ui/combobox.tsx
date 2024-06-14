"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type React from "react";
import { useEffect, useState } from "react";
import { CheckIcon, type IconProps } from "./icons";
import Kbd from "./kbd";

type Option = {
  value: string;
  label: string;
  icon?: React.FC<IconProps>;
};

export const LinearCombobox = ({
  options,
  onValueChange,
}: { options: Option[]; onValueChange?: (value: string) => void }) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const isSearching = searchValue.length > 0;

  useEffect(() => {
    if (selectedOption && onValueChange) {
      onValueChange(selectedOption.value);
    }
  }, [selectedOption, onValueChange]);

  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Select option"
          variant="ghost"
          size="lg"
          className="w-fit px-2 h-8 text-[0.8125rem] leading-normal font-medium text-primary"
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
          ) : (
            <>Select an option</>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[206px] p-0 rounded-lg"
        align="start"
        onCloseAutoFocus={(e) => e.preventDefault()}
        sideOffset={6}
      >
        <Command className="rounded-lg relative">
          <CommandInput
            value={searchValue}
            onValueChange={(searchValue) => {
              // If the user types a number, then set as the selected option
              if (Number.parseInt(searchValue) < options.length) {
                const possibleOption = options[Number.parseInt(searchValue)];
                if (possibleOption) {
                  setSelectedOption(possibleOption);
                  setOpenPopover(false);
                  setSearchValue("");
                  return;
                }
              }
              setSearchValue(searchValue);
            }}
            className="text-[0.8125rem] leading-normal"
            placeholder="Type Option no"
          />
          <Kbd className="absolute left-44 top-4">
            <p>P</p>
          </Kbd>

          <CommandList>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(value) => {
                    setSelectedOption(
                      options.find((p) => p.value === value) || null,
                    );
                    setOpenPopover(false);
                    setSearchValue("");
                  }}
                  className="group rounded-md flex justify-between items-center w-full text-[0.8125rem] leading-normal text-primary"
                >
                  <div className="flex items-center">
                    {option.icon && (
                      <option.icon className="mr-2 size-4 fill-muted-foreground group-hover:fill-primary" />
                    )}
                    <span>{option.label}</span>
                  </div>
                  <div className="flex items-center">
                    {selectedOption?.value === option.value && (
                      <CheckIcon className="mr-3 size-4 fill-muted-foreground group-hover:fill-primary" />
                    )}
                    {!isSearching && <span className="text-xs">{index}</span>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
