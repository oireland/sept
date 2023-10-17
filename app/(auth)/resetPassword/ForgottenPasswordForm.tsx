"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikInput from "../../../components/FormikInput";
import { HiAtSymbol } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import getURL from "@/lib/getURL";
import axios from "axios";

interface FormData {
  email: string;
}

const validationSchema: Yup.ObjectSchema<FormData> = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

type Props = {
  setIsSent: React.Dispatch<React.SetStateAction<boolean>>;
};

const ForgottenPasswordForm: FC<Props> = ({ setIsSent }) => {
  const handleFormSubmit = async (email: string) => {
    let toastId = toast.loading("Sending email...");
    try {
      await axios.post(getURL("/api/auth/sendPasswordResetEmail"), { email });
      toast.dismiss(toastId);
      toastId = toast.success("Email sent!");
      setIsSent(true);
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof Error) {
        toast.error(e.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const initialValues: FormData = {
    email: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={({ email }) => {
        handleFormSubmit(email);
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
        <div className="flex justify-end">
          <Button variant={"form"} type="submit" className="mt-2">
            Send
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default ForgottenPasswordForm;
