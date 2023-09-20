import { FC } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/FormikInput";

import PasswordField from "../../../components/FormikPasswordField";
import { HiOutlineLibrary, HiAtSymbol } from "react-icons/hi";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { signIn } from "next-auth/react";
import getURL from "@/lib/getURL";
import { toast } from "react-hot-toast";

interface FormData {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  name: Yup.string().required("Organisation name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string()
    .matches(
      /(?=^.{6,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/,
      "At least one: uppercase, lowercase, number and symbol. 6-20 characters."
    )
    .required("Password is required"),
  passwordRepeat: Yup.string()
    .required("Required")
    .test("password-match", "Password must match", function (value) {
      return this.parent.password === value;
    }),
});

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface Props {
  role: UserRole;
}

const SignUpForm: FC<Props> = ({ role }) => {
  const handleFormSubmit = async (formData: UserData) => {
    const data = { ...formData, role };
    let toastId = toast.loading("Creating account...");
    try {
      await axios.post(getURL("/api/auth/createUser"), data);
      toast.dismiss(toastId);
      toastId = toast.success("Account Created", { duration: 300 });

      await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/confirm",
      });
    } catch (e) {
      toast.dismiss(toastId);
      toastId = toast.error("Something went wrong!");
      console.log("An error has occured creating the user");
    }
  };

  const initialValues: FormData = {
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(formData) => handleFormSubmit(formData)}
    >
      <Form className="p-4">
        <FormikInput
          name="name"
          type="input"
          label={role === UserRole.HOST ? "School Name" : "Name"}
          Icon={HiOutlineLibrary}
          placeholder={
            role === UserRole.HOST
              ? "e.g. Blue Finch School"
              : "e.g. John Smith"
          }
        />
        <FormikInput
          name="email"
          type="input"
          label="Email address"
          placeholder="example@email.com"
          Icon={HiAtSymbol}
        />
        <PasswordField name="password" label="Password" />
        <PasswordField name="passwordRepeat" label="Confirm Password" />
        <div className="flex justify-end">
          <Button variant={"form"} type="submit" className="mt-2">
            Submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default SignUpForm;
