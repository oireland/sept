import { FieldAttributes } from "formik";
import { FC, useState } from "react";
import FormikInput from "./FormikInput";
import { Eye, EyeOff } from "lucide-react";

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
        Icon={show ? Eye : EyeOff}
        onIconClick={() => setShow(!show)}
      />
    </>
  );
};

export default PasswordField;
