import { FieldAttributes } from "formik";
import React, { FC, useState } from "react";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import FormikInput from "./FormikInput";

type MyInputProps = {
  placeholder?: string;
  label: string;
} & FieldAttributes<{}>;

const PasswordField: FC<MyInputProps> = (props) => {
  const [show, setShow] = useState<boolean>(false);
  return (
    <>
      <FormikInput
        type={show ? "text" : "password"}
        {...props}
        Icon={show ? HiOutlineEye : HiOutlineEyeOff}
        onIconClick={() => setShow(!show)}
      />
    </>
  );
};

export default PasswordField;
