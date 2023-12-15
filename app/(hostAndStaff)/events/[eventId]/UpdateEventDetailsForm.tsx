"use client";

import { FC } from "react";
import { Formik, Form } from "formik";
import * as yup from "yup";

import FormikSelect from "@/components/FormikSelect";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import FormikInput from "@/components/FormikInput";
import { FormikCombobox } from "@/components/FormikCombobox";

type FormData = {
  date: string;
  locationName: string;
  staffId?: string;
};

type Staff = {
  staffId: string;
  staffName: string;
};

type Props = {
  currentDate: Date;
  locationNames: string[];
  currentLocationName: string;
  staff: Staff[];
  currentStaff?: Staff;
  eventId: string;
};

const UpdateEventDetailsForm: FC<Props> = ({
  currentDate,
  locationNames,
  currentLocationName,
  staff,
  currentStaff,
  eventId,
}) => {
  const handleFormSubmit = async ({
    locationName,
    date,
    staffId,
  }: FormData) => {
    let toastId = toast.loading("Updating event details...");
    try {
      await axios.patch(getURL("/api/update/updateEventDetails"), {
        eventId,
        date,
        locationName,
        staffId,
      });

      toast.dismiss(toastId);
      toastId = toast.success("Event details updated");
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
    date: currentDate.toISOString().slice(0, -8),
    locationName: currentLocationName,
    staffId: currentStaff?.staffId,
  };

  const validationSchema = yup.object({
    date: yup
      .date()
      .required()
      .test(
        "futureDate",
        "Date must be in the future",
        (date) => new Date() < date,
      ),
    locationName: yup.string().required(),
    staffId: yup.string(),
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
        <FormikInput type="datetime-local" name="date" label="Date" />

        <div className="flex space-x-4 w-full ">
          <FormikCombobox
            items={locationNames.map((locationName) => ({
              label: locationName,
              value: locationName,
            }))}
            name="locationName"
            label="Location"
            className="w-full"
          />

          <FormikCombobox
            items={staff.map(({ staffId, staffName }) => ({
              label: staffName,
              value: staffId,
            }))}
            name="staffId"
            label="Staff"
            className="w-full"
          />
        </div>

        <div className="flex items-center justify-end mt-1">
          <Button type="submit" variant={"outline"}>
            Save
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default UpdateEventDetailsForm;
