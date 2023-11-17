"use client";

import { FC } from "react";
import { Formik, Form, FieldAttributes, useField } from "formik";

import { EventType } from "@prisma/client";

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
    scores: number[];
  }[];
};

type Props = {
  athletes: { athleteId: string; name: string; scores: number[] }[];
  eventId: string;
  eventType: EventType;
  numberOfAttempts: number;
};

const EnterResultsForm: FC<Props> = ({
  athletes,
  eventId,
  eventType,
  numberOfAttempts,
}) => {
  const router = useRouter();

  const handleFormSubmit = async (data: FormData) => {
    let toastId = toast.loading("Saving...");
    try {
      await axios.post(getURL("/api/create/createResults"), {
        results: data.results,
        eventId,
      });

      toast.dismiss(toastId);
      toastId = toast.success("Results Saved!");
      router.refresh();
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
    results: athletes.map(({ athleteId, scores }) => ({
      athleteId,
      scores,
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
            {eventType === "TRACK" ? "Times" : "Distances"}
          </h3>
        </div>
        <div className="space-y-2">
          {athletes.map(({ name }, index) => (
            <ScoreInput
              numberOfAttempts={numberOfAttempts}
              index={index}
              key={index}
              label={name}
              name="results"
            />
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
  numberOfAttempts: number;
} & FieldAttributes<{}>;

const ScoreInput: FC<ScoreInputProps> = ({
  placeholder,
  label,
  index,
  numberOfAttempts,
  ...props
}) => {
  const [field, meta, helpers] = useField<
    {
      athleteUserId: string;
      scores: number[];
    }[]
  >(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <div className="grid grid-cols-3">
      <label className="text-base" htmlFor={props.id}>
        {label}
      </label>

      <div className="col-span-2 flex space-x-1">
        {Array.from(Array(numberOfAttempts)).map((a, j) => (
          <div key={j} className="input_group w-full">
            <input
              type="number"
              step={0.01}
              min={0}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(e) => {
                let newValue = value;
                newValue[index].scores[j] = Number(e.currentTarget.value);
                setValue(newValue);
              }}
              className="input_text h-10"
              value={Number(value[index].scores[j]).toString()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
