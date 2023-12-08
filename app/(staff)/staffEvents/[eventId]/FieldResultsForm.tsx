"use client";

import { FC } from "react";
import { Formik, Form, FieldAttributes, useField } from "formik";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import BackButton from "@/components/BackButton";
import getURL from "@/lib/getURL";
import { FieldResultsInputSchema } from "@/lib/yupSchemas";
import { useRouter } from "next/navigation";

type FormData = {
  results: {
    athleteId: string;
    distances: number[];
  }[];
};

type Props = {
  athletes: { athleteId: string; name: string; distances: number[] }[];
  eventId: string;
};

const FieldResultForm: FC<Props> = ({ athletes, eventId }) => {
  const router = useRouter();

  const handleFormSubmit = async (data: FormData) => {
    let toastId = toast.loading("Saving...");
    try {
      await axios.post(getURL("/api/create/createFieldResults"), {
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
    results: athletes.map(({ athleteId, distances }) => ({
      athleteId,
      distances,
    })),
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={FieldResultsInputSchema}
      onSubmit={(values: FormData) => {
        handleFormSubmit(values);
      }}
    >
      <Form className="p-2 sm:p-4 md:p-6">
        <div className="mb-2 grid grid-cols-4">
          <h3 className="text-base font-semibold">Name</h3>
          <h3 className="text-base font-semibold text-left col-span-3">
            Distances
          </h3>
        </div>
        <div className="space-y-2">
          {athletes.map(({ name }, index) => (
            <div key={index}>
              <FieldScoreInput
                athleteIndex={index}
                label={name}
                name="results"
              />
            </div>
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

export default FieldResultForm;

type FieldScoreInputProps = {
  label: string;
  athleteIndex: number;
} & FieldAttributes<{}>;

const FieldScoreInput: FC<FieldScoreInputProps> = ({
  placeholder,
  label,
  athleteIndex,
  ...props
}) => {
  const [field, meta, helpers] = useField<
    {
      athleteUserId: string;
      distances: number[];
    }[]
  >(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  return (
    <div className="grid grid-cols-4">
      <label className="text-sm md:text-base overflow-x-clip">{label}</label>

      <div className="col-span-3 flex space-x-1">
        {Array.from(Array(3)).map((a, attemptIndex) => (
          <div key={attemptIndex} className="input_group w-full">
            <input
              type="number"
              step={0.01}
              min={0}
              name={field.name}
              onBlur={field.onBlur}
              onChange={(e) => {
                let newValue = value;
                newValue[athleteIndex].distances[attemptIndex] = Number(
                  e.currentTarget.value,
                );
                setValue(newValue);
              }}
              className="input_text h-10"
              value={Number(
                value[athleteIndex].distances[attemptIndex],
              ).toString()}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
