"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/FormikInput";
import PasswordField from "../../../components/FormikPasswordField";
import { HiAtSymbol } from "react-icons/hi";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import getURL from "@/lib/getURL";

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
    try {
      await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      router.push("/dashboard");
      toast.dismiss(toastId);
      toastId = toast.success("Successfully signed in");
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Something went wrong");
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
