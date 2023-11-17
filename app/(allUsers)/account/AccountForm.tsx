"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import FormikInput from "../../../components/FormikInput";

import PasswordField from "../../../components/FormikPasswordField";
import { HiOutlineLibrary, HiAtSymbol } from "react-icons/hi";
import { Button } from "@/components/ui/button";
import axios from "axios";
import getURL from "@/lib/getURL";
import { toast } from "react-hot-toast";
import { AtSign, Library } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  newPasswordRepeat: string;
}

const validationSchema: yup.ObjectSchema<FormData> = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup
    .string()
    .matches(
      /(?=^.{6,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/,
      "At least one: uppercase, lowercase, number and symbol. 6-20 characters."
    )
    .required("Password is required")
    .test(
      "different-new-password",
      "The new password must be different to your old password",
      function (value) {
        return this.parent.oldPassword !== value;
      }
    ),
  newPasswordRepeat: yup
    .string()
    .required("Required")
    .test("password-match", "Password must match", function (value) {
      return this.parent.newPassword === value;
    }),
});

type Props = {
  initialValues: FormData;
};

const AccountForm: FC<Props> = ({ initialValues }) => {
  const handleFormSubmit = async (formData: FormData) => {
    let toastId = toast.loading("Updating account details...");
    try {
      await axios.patch(getURL("/api/update/updateAccountDetails"), {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        name: formData.name,
        email: formData.email,
      });

      toast.dismiss(toastId);
      toastId = toast.success("Account details updated", { duration: 300 });
    } catch (e) {
      toast.dismiss(toastId);
      toastId = toast.error("Something went wrong!");
    }
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
          label="Your Name"
          Icon={Library}
        />
        <FormikInput
          name="email"
          type="input"
          label="Email address"
          placeholder="example@email.com"
          Icon={AtSign}
        />
        <PasswordField name="oldPassword" label="Old Password" />

        <PasswordField name="newPassword" label="New Password" />
        <PasswordField name="newPasswordRepeat" label="Confirm New Password" />
        <div className="flex justify-end">
          <Button variant={"form"} type="submit" className="mt-2">
            Save
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default AccountForm;
