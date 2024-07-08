"use client";

import { Radio, RadioGroup } from "@headlessui/react";
import { RiCheckboxCircleFill as CheckCircleIcon } from "@remixicon/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const options = [
  {
    id: "POST_MONEY",
    title: "Post-money",
    description: "Value of the company after the investment is made.",
  },
  {
    id: "PRE_MONEY",
    title: "Pre-money",
    description: "Value of the company before the investment is made.",
  },
];

type SelectorProps = {
  defaultValue: string;
  onChange: (value: string) => void;
};

export const PrePostSelector = ({ defaultValue, onChange }: SelectorProps) => {
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    setSelected(defaultValue);
  }, [defaultValue]);

  return (
    <fieldset>
      <RadioGroup
        value={selected}
        onChange={(value: string) => {
          setSelected(value);
          onChange(value);
        }}
        className="mb-2 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4"
      >
        {options.map((option) => (
          <Radio
            key={option.id}
            value={option.id}
            aria-label={option.title}
            aria-description={`${option.title} - ${option.description}`}
            className="group relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none data-[focus]:border-teal-600 data-[focus]:ring-2 data-[focus]:ring-teal-600"
          >
            <span className="flex flex-1">
              <span className="flex flex-col">
                <span className="block text-sm font-medium text-gray-900">
                  {option.title}
                </span>
                <span className="mt-1 flex items-center text-sm text-gray-500">
                  {option.description}
                </span>
              </span>
            </span>
            <CheckCircleIcon
              aria-hidden="true"
              className="h-5 w-5 text-teal-600 [.group:not([data-checked])_&]:invisible"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[focus]:border group-data-[checked]:border-teal-600"
            />
          </Radio>
        ))}
      </RadioGroup>

      <span className="text-gray-500 text-xs">
        {/* TODO: Write an article about the difference between pre-money and post-money */}
        <Link
          className="hover:underline text-teal-600 hover:text-teal-500"
          href="https://captable.inc/help"
          target="_blank"
        >
          Click here
        </Link>{" "}
        to learn more about the difference between pre-money and post-money
        investments.
      </span>
    </fieldset>
  );
};
