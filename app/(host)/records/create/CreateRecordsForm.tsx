"use client";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import * as yup from "yup";
import SingleCsvForm from "../../../../components/SingleCsvForm";
import getURL from "@/lib/getURL";

type Props = {
  allowedEventIds: string[];
};

const CreateRecordsForm = ({ allowedEventIds }: Props) => {
  const router = useRouter();
  const RecordSchema = yup
    .object({
      eventId: yup
        .string()
        .required("Event Id is required")
        .test(
          "isAllowedEventId",
          "At least one of the events in your file has an invalid eventId",
          (eventId) => {
            return allowedEventIds.includes(eventId);
          },
        ),
      eventName: yup.string().required(),
      recordHolderName: yup.string().required(),
      yearRecordSet: yup
        .number()
        .integer()
        .typeError("Year Record Set must be an integer")
        .min(1700, "Year Record Set cannot be before 1700")
        .max(
          new Date().getUTCFullYear(),
          "Year Record Set cannot be a year in the future",
        )
        .required(),
      recordScore: yup
        .number()
        .typeError("Record Score must be a number")
        .required()
        .min(0, "Record Score cannot be less than 0."),
    })
    .required();

  type Record = yup.InferType<typeof RecordSchema>;

  const [records, setRecords] = useState<Record[]>();

  const onFileChange = async (resultArray: string[]) => {
    resultArray = resultArray.slice(1);
    let toastId = toast.loading("Loading file...");
    try {
      const unvalidatedRecordObjectArray: {}[] = [];

      resultArray.forEach((record) => {
        // Prevents empty lines from causing an error
        if (record === "") return;

        const recordSplit = record.split(",");
        // forming an object from the array so that it can be validated against the schema
        unvalidatedRecordObjectArray.push({
          eventId: recordSplit[0],
          eventName: recordSplit[1],
          recordHolderName: recordSplit[2],
          yearRecordSet: recordSplit[3],
          recordScore: recordSplit[4],
        });
      });
      const recordsObjectArray = await yup
        .array(RecordSchema)
        .required()
        .min(1)
        .validate(unvalidatedRecordObjectArray);

      setRecords(recordsObjectArray);

      toast.dismiss(toastId);
      toastId = toast.success("File uploaded successfully");
    } catch (e) {
      if (e instanceof Error) {
        toast.dismiss(toastId);
        toastId = toast.error(e.message);
      } else {
        toast.dismiss(toastId);
        toastId = toast.error("The file is invalid");
      }
      setRecords(undefined);
    }
  };

  const onSubmit = async () => {
    let toastId = toast.loading("Submitting...");
    try {
      if (!records) {
        throw new Error("Please upload a valid file");
      }
      await axios.patch(getURL("/api/update/addRecordsToEvents"), {
        records,
      });
      toast.dismiss(toastId);
      toastId = toast.success("Records created successfully");
      router.push("/events");
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof AxiosError) {
        toastId = toast.error(e.response?.data);
      } else if (e instanceof Error) {
        toastId = toast.error(e.message);
      } else {
        toastId = toast.error("Something went wrong!");
      }
    }
  };

  return (
    <SingleCsvForm
      onFileChange={onFileChange}
      onSubmit={onSubmit}
      inputName="recordInput"
    />
  );
};

export default CreateRecordsForm;
