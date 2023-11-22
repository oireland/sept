"use client";

import * as React from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronsDown,
  ChevronsUpDown,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FieldAttributes, useField } from "formik";
import { PopoverAnchor } from "@radix-ui/react-popover";

type Props = {
  items: {
    value: string;
    label: string;
  }[];
  label: string;
} & FieldAttributes<{}>;

export function FormikCombobox({ items, label, className, ...props }: Props) {
  const [open, setOpen] = React.useState(false);
  const [field, meta, helpers] = useField<string>(props.name);

  const { setValue } = helpers;
  const { value } = field;

  return (
    <div className={className}>
      <div className=" flex gap-2">
        <label className="text-sm" htmlFor={props.id}>
          {label}
        </label>
        {meta.touched && meta.error && (
          <div className="flex items-center text-xs text-brg">
            <AlertCircle className="peer h-5 w-5 pr-1" />
            <p className="hidden hover:flex peer-hover:flex">{meta.error}</p>
          </div>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between text-black opacity-100 text-sm font-normal",
            )}
          >
            {field.value
              ? items.find((item) => item.value === field.value)?.label
              : "Select"}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          avoidCollisions={false}
          className="p-0"
          asChild
        >
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={() => {
                    setValue(item.value);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      item.value === field.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
