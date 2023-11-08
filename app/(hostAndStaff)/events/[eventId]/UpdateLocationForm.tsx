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
import { EventValidationSchema } from "@/lib/yupSchemas";
import BackButton from "@/components/BackButton";
import { RiErrorWarningLine } from "react-icons/ri";

type FormData = {
  locationId: string;
};

type Location = {
  locationId: string;
  locationName: string;
};

type Props = {
  locations: Location[];
  currentLocation: Location;
  eventId: string;
};

const UpdateLocationForm: FC<Props> = ({
  locations,
  currentLocation,
  eventId,
}) => {
  const handleFormSubmit = async ({ locationId }: FormData) => {
    let toastId = toast.loading("Updating location...");
    try {
      await axios.patch(getURL("/api/update/updateEventLocation"), {
        eventId,
        locationId,
      });

      toast.dismiss(toastId);
      toastId = toast.success("Location updated");
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
    locationId: currentLocation.locationId,
  };

  const validationSchema: yup.ObjectSchema<FormData> = yup.object({
    locationId: yup.string().required(),
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
            items={locations.map(({ locationId, locationName }) => ({
              content: locationName,
              value: locationId,
            }))}
            name="locationId"
          />

          <Button type="submit" variant={"outline"}>
            Update
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default UpdateLocationForm;
