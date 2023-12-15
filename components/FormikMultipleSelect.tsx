"use client";

import * as React from "react";
import { AlertCircle, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { FieldAttributes, useField } from "formik";
import { Button } from "./ui/button";
import { RiErrorWarningLine } from "react-icons/ri";

type Item = {
  value: string;
  label: string;
};

type Props = {
  items: Item[];
  label: string;
} & FieldAttributes<{}>;

export function FormikMultipleSelect({
  items,
  label,
  placeholder,
  ...props
}: Props) {
  const [field, meta, helpers] = useField<string[]>(props.name);
  const { setValue } = helpers;
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Item[]>([]);

  const handleUnselect = React.useCallback(
    (item: Item) => {
      setSelected((prev) => prev?.filter((s) => s.value !== item.value));
      setValue(
        selected
          .filter((s) => s.value !== item.value)
          .map(({ value }) => value),
      );
    },
    [selected, setValue],
  );

  const selectables = items.filter((item) => !selected?.includes(item));

  return (
    <div>
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
      <Command className="overflow-visible bg-transparent">
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selected.map((item) => {
              return (
                <Badge key={item.value} variant="outline">
                  {item.label}
                  <button
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => {
                      handleUnselect(item);
                    }}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              );
            })}
            {/* Avoid having an input, only showing the dropdown */}
            <Button
              type="button"
              onBlur={() => {
                setOpen(false);
              }}
              onClick={() => setOpen(!open)}
              className="ml-2 h-6 flex-1 cursor-pointer bg-transparent outline-none"
            />
          </div>
        </div>
        <div className="relative mt-2">
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((item) => {
                  return (
                    <CommandItem
                      key={item.value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onSelect={() => {
                        setSelected((prev) => [...prev, item]);
                        setValue([
                          ...selected.map(({ value }) => value),
                          item.value,
                        ]);
                      }}
                      className={"cursor-pointer"}
                    >
                      {item.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          ) : null}
        </div>
      </Command>
    </div>
  );
}
