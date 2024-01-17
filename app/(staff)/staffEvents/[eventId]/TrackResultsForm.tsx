"use client";

import { FC, useState } from "react";
import { Formik, Form, FieldAttributes, useField } from "formik";

import { EventType } from "@prisma/client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import BackButton from "@/components/BackButton";
import getURL from "@/lib/getURL";
import { TrackResultsInputSchema } from "@/lib/yupSchemas";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

type FormData = {
  results: {
    athleteId: string;
    time: number;
  }[];
};

type Props = {
  athletes: { athleteId: string; name: string; time: number }[];
  eventId: string;
};

const TrackResultsForm: FC<Props> = ({ athletes, eventId }) => {
  const router = useRouter();

  const handleFormSubmit = async (data: FormData) => {
    let toastId = toast.loading("Saving...");
    try {
      await axios.post(getURL("/api/create/createTrackResults"), {
        results: data.results,
        eventId,
      });

      toast.dismiss(toastId);
      toastId = toast.success("Results Saved!");
      router.refresh();
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
    results: athletes.map(({ athleteId, time }) => ({
      athleteId,
      time,
    })),
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={TrackResultsInputSchema}
      onSubmit={(values: FormData) => {
        handleFormSubmit(values);
      }}
    >
      <Form className="p-2 sm:p-4 md:p-6">
        <div className="mb-2 grid grid-cols-3">
          <h3 className="text-base font-semibold">Name</h3>
          <h3 className="text-base font-semibold">Time (s)</h3>
        </div>
        <div className="space-y-2">
          {athletes.map(({ name }, index) => (
            <div key={index}>
              <TrackScoreInput index={index} label={name} name="results" />
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

export default TrackResultsForm;

type TrackScoreInputProps = {
  label: string;
  index: number;
} & FieldAttributes<{}>;

const TrackScoreInput: FC<TrackScoreInputProps> = ({
  placeholder,
  label,
  index,
  ...props
}) => {
  const [field, meta, helpers] = useField<
    {
      athleteUserId: string;
      time: number;
    }[]
  >(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  const [fieldValue, setFieldValue] = useState("");

  return (
    <div className="grid grid-cols-4">
      <label className="text-sm md:text-base overflow-x-clip">{label}</label>

      <div className="col-span-3 input_group flex space-x-1">
        <Input
          type="number"
          step={0.01}
          min={0}
          name={field.name}
          onBlur={field.onBlur}
          onChange={(e) => {
            let targetVal = e.currentTarget.value;
            if (!targetVal) {
              targetVal = "0";
            }
            // test that the entered value won't be NaN and isn't over 2 dp
            if (/^(\d+\.?(\d?){2})$/.test(targetVal)) {
              console.log("Won't be NaN");
              let numberValue = Number(
                Number(e.currentTarget.value).toFixed(2),
              );

              let newValue = value;
              newValue[index].time = numberValue;
              setValue(newValue);

              // append a decimal point if there was one in the entered string
              if (targetVal.endsWith(".")) {
                setFieldValue(numberValue + ".");
              } else {
                setFieldValue(targetVal);
              }
            }
          }}
          className="input_text h-10"
          value={fieldValue}
        />
      </div>
    </div>
  );
};
