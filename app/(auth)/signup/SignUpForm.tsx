"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/FormikInput";

import PasswordField from "../../../components/FormikPasswordField";
import { HiOutlineLibrary, HiAtSymbol } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { signIn } from "next-auth/react";
import getURL from "@/lib/getURL";
import { toast } from "react-hot-toast";
import { AtSign, Library } from "lucide-react";

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

const SignUpForm = () => {
  const handleFormSubmit = async (formData: UserData) => {
    let toastId = toast.loading("Creating account...");
    try {
      await axios.post(getURL("/api/auth/createUser"), formData);
      toast.dismiss(toastId);
      toastId = toast.success("Account Created", { duration: 300 });

      await signIn("credentials", {
        email: formData.email,
        password: formData.password,
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
          label="School Name"
          Icon={Library}
          placeholder="e.g. Blue Finch School"
        />
        <FormikInput
          name="email"
          type="input"
          label="Email address"
          placeholder="example@email.com"
          Icon={AtSign}
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
