"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";
import FormikInput from "../../../components/FormikInput";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import getURL from "@/lib/getURL";
import { Users2Icon } from "lucide-react";
import axios, { AxiosError } from "axios";
type FormData = {
  groupName: string;
};

const validationSchema: yup.ObjectSchema<FormData> = yup.object().shape({
  groupName: yup.string().required("Required"),
});

const GroupForm: FC = () => {
  const router = useRouter();
  const handleFormSubmit = async (data: FormData) => {
    let toastId = toast.loading("Adding...");
    try {
      await axios.post(getURL("/api/create/addGroup"), data);
      toast.dismiss(toastId);
      toastId = toast.success("Group Added");
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
    groupName: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(data, { resetForm }) => {
        resetForm({
          values: { groupName: "" },
          touched: { groupName: false },
          errors: { groupName: undefined },
        });
        handleFormSubmit(data);
      }}
    >
      <Form>
        <div className="flex w-full items-center justify-between space-x-4">
          <FormikInput
            name="groupName"
            type="input"
            label="Group Name"
            placeholder="E.g. Year 8"
            Icon={Users2Icon}
          />

          <Button variant={"outline"} type="submit" className="mt-4">
            Add
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default GroupForm;
