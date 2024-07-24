"use client";

import { RiCalendar2Line as CalendarIcon } from "@remixicon/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { SelectSingleEventHandler } from "react-day-picker";

export type DatePickerProps = {
  className?: string;
  dateFormat?: string;
  disabled?: boolean;
  locale?: string;
  selected: Date;
  onSelect: SelectSingleEventHandler;
  placeholder?: string;
};

const DatePicker = ({
  className,
  dateFormat,
  disabled,
  locale,
  selected,
  onSelect,
  placeholder,
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full text-left font-normal",
            !selected && "text-muted-foreground",
          )}
        >
          {selected ? format(selected, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={new Date(selected)}
          onSelect={onSelect}
          disabled={(date) => {
            if (disabled) return true;
            return date > new Date() || date < new Date("1900-01-01");
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
