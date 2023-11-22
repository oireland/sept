import FileInputCsv from "@/components/FileInputCsv";
import { Button } from "@/components/ui/button";
import { Form, Formik } from "formik";
import Link from "next/link";
import React, { useRef } from "react";
import * as Yup from "yup";
import BackButton from "./BackButton";

type SingleCsvFormProps = {
  onFileChange: (resultArray: string[]) => void;
  onSubmit: () => void;
  inputLabel: string;
  inputName: string;
};

const SingleCsvForm = ({
  onFileChange,
  onSubmit,
  inputName,
  inputLabel,
}: SingleCsvFormProps) => {
  const fileRef = useRef<HTMLInputElement>(null);

  const validationSchema = Yup.object({
    file: Yup.mixed()
      .test("is-file-too-big", "File exceeds 10MB", () => {
        if (!fileRef.current?.files) {
          return true;
        }
        if (!fileRef.current.files[0]) {
          return true;
        }

        if (fileRef.current.files[0].size / 1024 / 1024 < 10) {
          return true;
        }

        return false;
      })
      .test("is-file-of-correct-type", "File must be .csv", () => {
        if (!fileRef.current?.files) {
          return true;
        }
        if (!fileRef.current.files[0]) {
          return true;
        }

        if (fileRef.current.files[0].type !== "csv") {
          return true;
        }
        return false;
      }),
  });

  const initialValues = {
    file: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      <Form className="">
        <FileInputCsv
          label={inputLabel}
          name={inputName}
          fileRef={fileRef}
          handleFileChange={onFileChange}
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

export default SingleCsvForm;
