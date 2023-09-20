"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/FormikInput";
import FormNavigationButton from "../../../components/SubmitButton";
import PasswordField from "../../../components/FormikPasswordField";
import { HiAtSymbol } from "react-icons/hi";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { redirect, useRouter } from "next/navigation";
import getURL from "@/lib/getURL";
import { Button } from "@/components/ui/button";

interface FormData {
  email: string;
  password: string;
}

const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  password: Yup.string().required("Password is required"),
});

interface Credentials {
  email: string;
  password: string;
}

const LoginForm: FC = () => {
  const router = useRouter();
  const handleFormSubmit = async ({ email, password }: Credentials) => {
    let toastId = toast.loading("Signing in...");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    toast.dismiss(toastId);
    console.log(res);

    if (res?.error) {
      toastId = toast.error(res.error);
    } else {
      toastId = toast.success("Successfully signed in");
      router.push("/dashboard");
    }
  };

  const initialValues: FormData = {
    email: "",
    password: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={({ email, password }) => {
        handleFormSubmit({ email, password });
      }}
    >
      <Form className="p-4">
        <FormikInput
          name="email"
          type="input"
          label="Email address"
          placeholder="example@email.com"
          Icon={HiAtSymbol}
        />
        <PasswordField name="password" label="Password" />
        <div className="flex justify-end">
          <Button variant={"form"} type="submit" className="mt-2">
            Login
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default LoginForm;
