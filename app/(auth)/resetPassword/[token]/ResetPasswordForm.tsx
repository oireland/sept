"use client";

import { Formik, Form } from "formik";
import * as yup from "yup";

import { HiAtSymbol } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import getURL from "@/lib/getURL";
import axios, { AxiosError } from "axios";
import PasswordField from "@/components/FormikPasswordField";
import { useRouter } from "next/navigation";

interface FormData {
  password: string;
  passwordRepeat: string;
}

const validationSchema: yup.ObjectSchema<FormData> = yup.object().shape({
  password: yup
    .string()
    .matches(
      /(?=^.{6,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/,
      "At least one: uppercase, lowercase, number and symbol. 6-20 characters.",
    )
    .required("Password is required"),
  passwordRepeat: yup
    .string()
    .required("Required")
    .test("password-match", "Password must match", function (value) {
      return this.parent.password === value;
    }),
});

const ResetPasswordForm = ({ token }: { token: string }) => {
  const router = useRouter();
  const handleFormSubmit = async (password: string) => {
    let toastId = toast.loading("Resetting your password...");
    try {
      await axios.patch(getURL("/api/auth/resetPassword"), { password, token });
      toast.dismiss(toastId);
      toastId = toast.success("Password reset!");
      router.push(getURL("/signin"));
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof AxiosError) {
        toastId = toast.error(e.response?.data);
      } else {
        toastId = toast.error("Something went wrong!");
      }
    }
  };

  const initialValues: FormData = {
    password: "",
    passwordRepeat: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={({ password }) => {
        handleFormSubmit(password);
      }}
    >
      <Form className="p-4">
        <PasswordField name="password" label="New Password" />
        <PasswordField name="passwordRepeat" label="Confirm New Password" />

        <div className="flex justify-end">
          <Button variant={"form"} type="submit" className="mt-2">
            Submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default ResetPasswordForm;
