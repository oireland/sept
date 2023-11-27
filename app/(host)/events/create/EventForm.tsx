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
  eventType: EventType;
  boyOrGirl: BoyOrGirl[];
  groupNames: string[];
  maxNumberOfAthletesPerTeam: number;
  date: string;
  locationName: string;
};

const handleFormSubmit = async ({
  boyOrGirl,
  date,
  eventName,
  groupNames,
  locationName,
  maxNumberOfAthletesPerTeam,
  eventType,
}: FormData) => {
  let toastId = toast.loading("Creating event...");
  try {
    const data = {
      boyOrGirl,
      eventName,
      groupNames,
      maxNumberOfAthletesPerTeam,
      eventType,
      date: new Date(Date.parse(date)),
      locationName,
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

type Props = {
  groups: string[];
  locations: string[];
};

const EventForm: FC<Props> = ({ groups, locations }) => {
  const initialValues: FormData = {
    eventName: "",
    boyOrGirl: [],
    groupNames: [],
    eventType: "TRACK",
    maxNumberOfAthletesPerTeam: 2,
    date: "",
    locationName: locations[0],
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
            { value: "FIELD", content: "Long Jump or Throw" },
            { value: "HIGHJUMP", content: "High Jump or Pole Vault" },
          ]}
          label="Event Category"
          name="eventType"
        />

        <FormikInput type="datetime-local" name="date" label="Date" />

        <FormikSelect
          items={locations.map((location) => ({
            content: location,
            value: location,
          }))}
          label="Location"
          name="locationName"
        />

        <FormikMultipleSelect
          name="groupNames"
          label="Groups"
          items={groups.map((group) => ({
            value: group,
            label: group,
          }))}
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
          label="Max Number of Athletes Per Team"
          name="maxNumberOfAthletesPerTeam"
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

export default EventForm;

type IntegerInputProps = {
  label: string;
} & FieldAttributes<{}>;

const FormikIntegerInput: FC<IntegerInputProps> = ({ label, ...props }) => {
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
          onChange={(e) => helpers.setValue(parseInt(e.currentTarget.value))}
          className="input_text h-10 disabled:cursor-not-allowed"
          step={1}
          min={1}
          value={parseInt(field.value.toString()).toString()}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};
