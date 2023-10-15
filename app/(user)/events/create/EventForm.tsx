"use client";

import { FC } from "react";
import { Formik, Form } from "formik";

import { BoyOrGirl, EventType } from "@prisma/client";
import FormikInput from "@/components/FormikInput";
import FormikSelect from "@/components/FormikSelect";
import { Button } from "@/components/ui/button";
import { FormikMultipleSelect } from "@/components/FormikMultipleSelect";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import { EventValidationSchema } from "@/lib/yupSchemas";
import Link from "next/link";

interface FormData {
  eventName: string;
  trackOrField: EventType;
  boyOrGirl: BoyOrGirl[];
  groups: string[];
}

interface Props {
  groups: string[];
}

const handleFormSubmit = async (data: FormData) => {
  let toastId = toast.loading("Creating event...");
  try {
    await axios.post(getURL("/api/create/createManyEvents"), data);

    toast.dismiss(toastId);
    toastId = toast.success("Event created");
    window.location.reload();
  } catch (e) {
    toast.dismiss(toastId);
    if (e instanceof AxiosError) {
      toastId = toast.error(e.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

const EventForm: FC<Props> = ({ groups }) => {
  const initialValues: FormData = {
    eventName: "",
    boyOrGirl: [],
    groups: [],
    trackOrField: "TRACK",
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EventValidationSchema}
      onSubmit={(values: FormData) => {
        handleFormSubmit(values);
      }}
    >
      <Form className="p-4">
        <FormikInput
          label="Event Name"
          name="eventName"
          placeholder="E.g Javelin"
          type="input"
        />

        <FormikSelect
          items={[
            { value: "TRACK", content: "Track" },
            { value: "FIELD", content: "Field" },
          ]}
          label="Track / Field"
          name="trackOrField"
        />

        <FormikMultipleSelect
          name="groups"
          label="Groups"
          items={groups.map((group) => ({ value: group, label: group }))}
        />

        <FormikMultipleSelect
          name="boyOrGirl"
          label="Boy/Girl"
          items={[
            { value: "BOY", label: "Boy" },
            { value: "GIRL", label: "Girl" },
          ]}
        />

        <div className="flex justify-between">
          <Button type="button" variant="outline">
            <Link href={"/events"}>Back</Link>
          </Button>
          <Button type="submit" variant={"form"}>
            Submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default EventForm;
