"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import FormikInput from "../../../components/FormikInput";
import PasswordField from "../../../components/FormikPasswordField";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import getURL from "@/lib/getURL";
import { MapIcon } from "lucide-react";
import axios, { AxiosError } from "axios";
type FormData = {
  locationName: string;
};

const validationSchema: yup.ObjectSchema<FormData> = yup.object().shape({
  locationName: yup.string().required("Required"),
});

const LocationForm: FC = () => {
  const router = useRouter();
  const handleFormSubmit = async (data: FormData) => {
    let toastId = toast.loading("Adding...");
    try {
      await axios.post(getURL("/api/create/addLocation"), data);
      toast.dismiss(toastId);
      toastId = toast.success("Location Added");
      router.refresh();
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
    locationName: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(data, { resetForm }) => {
        resetForm({
          values: { locationName: "" },
          touched: { locationName: false },
          errors: { locationName: undefined },
        });
        handleFormSubmit(data);
      }}
    >
      <Form>
        <div className="flex w-full items-center justify-between space-x-4">
          <FormikInput
            name="locationName"
            type="input"
            label="Location Name"
            placeholder="E.g. Race Track"
            Icon={MapIcon}
          />

          <Button variant={"outline"} type="submit" className="mt-4">
            Add
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default LocationForm;
