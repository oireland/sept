"use client";

import { FC } from "react";
import { Formik, Form, FieldAttributes, useField } from "formik";
import * as yup from "yup";

import { BoyOrGirl, EventType } from "@prisma/client";
import FormikInput from "@/components/FormikInput";
import FormikSelect from "@/components/FormikSelect";
import { Button } from "@/components/ui/button";
import { FormikMultipleSelect } from "@/components/FormikMultipleSelect";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";

type FormData = {
  staffId: string;
};

type Staff = {
  staffId: string;
  staffName: string;
};

type Props = {
  staff: Staff[];
  currentStaff?: Staff;
  eventId: string;
};

const UpdateStaffForm: FC<Props> = ({ staff, currentStaff, eventId }) => {
  const handleFormSubmit = async ({ staffId }: FormData) => {
    let toastId = toast.loading("Updating staff...");
    try {
      await axios.patch(getURL("/api/update/updateEventStaff"), {
        eventId,
        staffId,
      });

      toast.dismiss(toastId);
      toastId = toast.success("Staff updated");
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof AxiosError) {
        toastId = toast.error(e.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const initialValues: FormData = {
    staffId: currentStaff?.staffId || "",
  };

  const validationSchema: yup.ObjectSchema<FormData> = yup.object({
    staffId: yup.string().required(undefined),
  });
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values: FormData) => {
        handleFormSubmit(values);
      }}
    >
      <Form>
        <div className="flex items-center justify-between space-x-4">
          <FormikSelect
            items={staff.map(({ staffId, staffName }) => ({
              content: staffName,
              value: staffId,
            }))}
            name="staffId"
          />

          <Button type="submit" variant={"outline"}>
            Update
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default UpdateStaffForm;
