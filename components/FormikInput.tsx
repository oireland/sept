import { FieldAttributes, useField } from "formik";
import React, { FC } from "react";
import { LucideIcon, AlertCircleIcon } from "lucide-react";

type MyInputProps = {
  placeholder?: string;
  label: string;
  Icon?: LucideIcon;
  onIconClick?: () => void;
} & FieldAttributes<{}>;

const FormikInput: FC<MyInputProps> = ({
  placeholder,
  label,
  Icon,
  onIconClick = () => {},
  ...props
}) => {
  const [field, meta] = useField<string>(props.name);

  return (
    <div className="mb-2 w-full space-y-1">
      <div className=" flex gap-2">
        <label className="text-sm" htmlFor={props.id}>
          {label}
        </label>
        {meta.touched && meta.error && (
          <div className="flex items-center text-xs text-brg">
            <AlertCircleIcon className="peer h-5 w-5 pr-1" />
            <p className="hidden hover:flex peer-hover:flex">{meta.error}</p>
          </div>
        )}
      </div>
      <div className="input_group">
        <input
          type={props.type}
          name={field.name}
          onBlur={field.onBlur}
          onChange={field.onChange}
          placeholder={placeholder ?? label}
          className="input_text h-10"
          value={field.value}
        />
        {/*  */}
        {Icon && (
          <div
            className="icon flex items-center px-4 hover:text-brg"
            onClick={() => onIconClick()}
          >
            <Icon />
          </div>
        )}
      </div>
    </div>
  );
};

export default FormikInput;
