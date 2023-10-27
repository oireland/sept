"use client";

import { FC } from "react";
import { Formik, Form, FieldAttributes, useField } from "formik";
import * as yup from "yup";

import { Athlete, EventType } from "@prisma/client";
import { AlertCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import BackButton from "@/components/BackButton";
import getURL from "@/lib/getURL";
import { ResultsInputSchema } from "@/lib/yupSchemas";
import { useRouter } from "next/navigation";

type FormData = {
  results: {
    athleteId: string;
    score: number;
  }[];
};

type Props = {
  athletes: Athlete[];
  eventId: string;
  eventType: EventType;
};

const EnterResultsForm: FC<Props> = ({ athletes, eventId, eventType }) => {
  const router = useRouter();
  const handleFormSubmit = async (data: FormData) => {
    let toastId = toast.loading("Saving...");
    try {
      const results = data.results.filter(({ score }) => score !== 0);
      await axios.post(getURL("/api/create/createResults"), {
        results: results,
        eventId,
      });

      toast.dismiss(toastId);
      toastId = toast.success("Results Saved!");
      router.push("/staffEvents");
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
    results: athletes.map(({ id }) => ({
      athleteId: id,
      score: 0,
    })),
  };
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ResultsInputSchema}
      onSubmit={(values: FormData) => {
        handleFormSubmit(values);
      }}
    >
      <Form className="p-4">
        <div className="mb-2 grid grid-cols-3">
          <h3 className="text-lg font-semibold">Name</h3>
          <h3 className="text-lg font-semibold">
            {eventType === "TRACK" ? "Time" : "Distance"}
          </h3>
        </div>
        <div className="space-y-2">
          {athletes.map(({ name }, index) => (
            <ScoreInput index={index} key={index} label={name} name="results" />
          ))}
        </div>

        <div className="mt-4 flex justify-between">
          <BackButton />
          <Button type="submit" variant={"form"}>
            Save
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default EnterResultsForm;

type ScoreInputProps = {
  label: string;
  index: number;
} & FieldAttributes<{}>;

const ScoreInput: FC<ScoreInputProps> = ({
  placeholder,
  label,
  index,
  ...props
}) => {
  const [field, meta, helpers] = useField<
    {
      athleteUserId: string;
      score: number;
    }[]
  >(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <div className="grid grid-cols-3">
      <label className="text-base" htmlFor={props.id}>
        {label}
      </label>

      <div className="input_group col-span-2">
        <input
          type="number"
          step={0.01}
          name={field.name}
          onBlur={field.onBlur}
          onChange={(e) => {
            let newValue = value;
            newValue[index].score = Number(e.currentTarget.value);
            setValue(newValue);
          }}
          className="input_text h-10"
        />
      </div>
    </div>
  );
};
