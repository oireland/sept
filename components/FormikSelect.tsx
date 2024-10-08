import { FieldAttributes, useField } from "formik";
import React, { FC } from "react";
import { RiErrorWarningLine } from "react-icons/ri";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type SelectItemType = {
  value: string;
  content: string;
};

type SelectProps = {
  label?: string;
  items: SelectItemType[];
} & FieldAttributes<{}>;

const FormikSelect: FC<SelectProps> = ({ label, items, ...props }) => {
  const [field, meta, helpers] = useField<string>(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <div className="mb-2 w-full space-y-1">
      <div className=" flex gap-2">
        <label className="text-sm">{label}</label>
        {meta.touched && meta.error && (
          <div className="flex items-center text-xs text-brg">
            <RiErrorWarningLine className="peer h-5 w-5 pr-1" />
            <p className="hidden hover:flex peer-hover:flex">{meta.error}</p>
          </div>
        )}
      </div>
      <Select
        value={value}
        onValueChange={(value) => setValue(value)}
        required
        name={field.name}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item, index) => (
            <SelectItem key={index} value={item.value}>
              {item.content}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormikSelect;
