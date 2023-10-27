"use client";

import { FC } from "react";
import { Formik, Form, FieldAttributes, useField } from "formik";

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
import BackButton from "@/components/BackButton";
import { RiErrorWarningLine } from "react-icons/ri";

interface FormData {
  eventName: string;
  trackOrField: EventType;
  boyOrGirl: BoyOrGirl[];
  groups: string[];
  maxNumberOfAthletes: number;
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
    maxNumberOfAthletes: 8,
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

        <FormikNumberInput
          label="Max Number of Athletes"
          name="maxNumberOfAthletes"
          step={1}
        />

        <div className="flex justify-between">
          <BackButton />
          <Button type="submit" variant={"form"}>
            Submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

type NumberInputProps = {
  label: string;
} & FieldAttributes<{}>;

const FormikNumberInput: FC<NumberInputProps> = ({ label, ...props }) => {
  const [field, meta, helpers] = useField<number>(props.name);

  return (
    <div className="mb-2 space-y-1">
      <div className=" flex gap-2">
        <label className="text-sm" htmlFor={props.id}>
          {label}
        </label>
        {meta.touched && meta.error && (
          <div className="flex items-center text-xs text-brg">
            <RiErrorWarningLine className="peer h-5 w-5 pr-1" />
            <p className="hidden hover:flex peer-hover:flex">{meta.error}</p>
          </div>
        )}
      </div>
      <div className="input_group">
        <input
          type="number"
          name={field.name}
          onBlur={field.onBlur}
          onChange={(e) => helpers.setValue(Number(e.currentTarget.value))}
          className="input_text h-10"
          step={1}
          min={2}
        />
      </div>
    </div>
  );
};

export default EventForm;
