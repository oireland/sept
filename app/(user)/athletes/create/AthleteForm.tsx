import FileInputCsv from "@/components/FileInputCsv";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import * as Yup from "yup";

type AthleteFormProps = {
  onAthleteFileChange: (resultArray: string[]) => void;
  onSubmit: () => void;
};

const AthleteForm = ({ onAthleteFileChange, onSubmit }: AthleteFormProps) => {
  const athleteFileRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object({
    athleteFile: Yup.mixed()
      .test("is-file-too-big", "File exceeds 10MB", () => {
        if (!athleteFileRef.current?.files) {
          return true;
        }
        if (!athleteFileRef.current.files[0]) {
          return true;
        }

        // if file size is less than 10MB - arbitrary size at the moment research size of a fairly large csv file
        if (athleteFileRef.current.files[0].size / 1024 / 1024 < 10) {
          return true;
        }

        return false;
      })
      .test("is-file-of-correct-type", "File must be .csv", () => {
        if (!athleteFileRef.current?.files) {
          return true;
        }
        if (!athleteFileRef.current.files[0]) {
          return true;
        }

        if (athleteFileRef.current.files[0].type !== "csv") {
          return true;
        }
        return false;
      }),
  });

  const initialValues = {
    athleteFile: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="">
        <FileInputCsv
          label="Athletes"
          name="athleteFile"
          fileRef={athleteFileRef}
          handleFileChange={onAthleteFileChange}
        />
        <div className="flex justify-end">
          <Button type="submit" variant={"form"}>
            Submit
          </Button>
        </div>
      </Form>
    </Formik>
  );
};

export default AthleteForm;
