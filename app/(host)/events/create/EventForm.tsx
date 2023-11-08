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
import BackButton from "@/components/BackButton";
import { RiErrorWarningLine } from "react-icons/ri";

type FormData = {
  eventName: string;
  trackOrField: EventType;
  boyOrGirl: BoyOrGirl[];
  groups: string[];
  maxNumberOfAthletes: number;
  numberOfAttempts: number;
  date: string;
  locationId: string;
};

type Props = {
  groups: string[];
  locations: {
    locationId: string;
    locationName: string;
  }[];
};

const handleFormSubmit = async ({
  boyOrGirl,
  date,
  eventName,
  groups,
  locationId,
  maxNumberOfAthletes,
  numberOfAttempts,
  trackOrField,
}: FormData) => {
  let toastId = toast.loading("Creating event...");
  try {
    const data = {
      boyOrGirl,
      eventName,
      groups,
      maxNumberOfAthletes,
      numberOfAttempts,
      trackOrField,
      date: new Date(Date.parse(date)),
      locationId,
    };
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

const EventForm: FC<Props> = ({ groups, locations }) => {
  const initialValues: FormData = {
    eventName: "",
    boyOrGirl: [],
    groups: [],
    trackOrField: "TRACK",
    maxNumberOfAthletes: 8,
    numberOfAttempts: 1,
    date: "",
    locationId: locations[0].locationId,
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={EventValidationSchema}
      onSubmit={(values: FormData) => {
        handleFormSubmit(values);
        // console.log(values);
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

        <FormikInput type="datetime-local" name="date" label="Date" />

        <FormikSelect
          items={locations.map(({ locationId, locationName }) => ({
            content: locationName,
            value: locationId,
          }))}
          label="Location"
          name="locationId"
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

        <FormikIntegerInput
          label="Max Number of Athletes"
          name="maxNumberOfAthletes"
        />

        <FormikIntegerInput
          label="Number of Attempts"
          name="numberOfAttempts"
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

const FormikIntegerInput: FC<NumberInputProps> = ({ label, ...props }) => {
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
          value={parseInt(field.value.toString()).toString()}
        />
      </div>
    </div>
  );
};

export default EventForm;
