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
import axios from "axios";
type FormData = {
  teamName: string;
};

const validationSchema: yup.ObjectSchema<FormData> = yup.object().shape({
  teamName: yup.string().required("Required"),
});

const TeamForm: FC = () => {
  const router = useRouter();
  const handleFormSubmit = async (data: FormData) => {
    let toastId = toast.loading("Adding...");
    try {
      await axios.post(getURL("/api/create/addTeam"), data);
      toast.dismiss(toastId);
      toastId = toast.success("Team Added");
      router.refresh();
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
    teamName: "",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(data) => {
        handleFormSubmit(data);
      }}
    >
      <Form>
        <div className="flex w-full items-center justify-between space-x-4">
          <FormikInput
            name="teamName"
            type="input"
            label="Team Name"
            placeholder="E.g. Red Team"
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

export default TeamForm;
