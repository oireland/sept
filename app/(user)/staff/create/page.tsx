"use client";
import React, { useState } from "react";
import SingleCsvForm from "../../../../components/SingleCsvForm";
import FloatingContainer from "@/components/FloatingContainer";
import InfoDialog from "./infoDialog";
import axios from "axios";
import getURL from "@/lib/getURL";
import * as yup from "yup";
import { StaffSchema } from "@/lib/yupSchemas";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";

type Staff = yup.InferType<typeof StaffSchema>;

const CreateStaff = () => {
  const session = useSession({ required: true });
  if (session.data?.user.role !== "HOST") {
    redirect("/");
  }

  const router = useRouter();

  const [staff, setStaff] = useState<Staff[]>();

  const onStaffFileChange = async (resultArray: string[]) => {
    let toastId = toast.loading("Loading file...");
    try {
      console.log(resultArray);

      const unvalidatedStaffObjectArray: {}[] = [];

      resultArray.forEach((staff) => {
        const staffSplit = staff.split(",");

        // Prevents empty lines from throwing an error
        if (staff === "") return;

        // do not add the athlete if it doesn't have the correct number of columns
        if (staffSplit.length !== 2) {
          throw new Error("Invalid File Format");
        }

        // forming an object from the array so that it can be validated against the schema
        unvalidatedStaffObjectArray.push({
          name: staffSplit[0],
          email: staffSplit[1],
        });
      });

      const staffObjectArray = await yup
        .array(StaffSchema)
        .validate(unvalidatedStaffObjectArray);

      if (staffObjectArray?.length === 0) {
        throw new Error("No file selected");
      }

      setStaff(staffObjectArray);
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
      setStaff(undefined);
    }
  };

  const onSubmit = async () => {
    let toastId = toast.loading("Submitting...");
    if (!staff) {
      toast.dismiss(toastId);
      toastId = toast.error("The file you have uploaded is invalid");
    }

    try {
      await axios.post(getURL("/api/create/createManyStaff"), {
        staff: staff,
      });
      toast.dismiss(toastId);
      toastId = toast.success("Staff created successfully");
      router.push("/staff");
    } catch (error) {
      toast.dismiss(toastId);
      toastId = toast.error("Something went wrong");
    }
  };

  return (
    <>
      <FloatingContainer className="p-4">
        <div className="flex items-center justify-between">
          <div></div>
          <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
            Sign up Staff
          </h2>
          <InfoDialog />
        </div>
        <SingleCsvForm
          onFileChange={onStaffFileChange}
          onSubmit={onSubmit}
          inputLabel="Staff"
          inputName="staffInput"
          backHref="/staff"
        />

        {staff && (
          <>
            <hr className="my-2" />

            <h3 className="text-lg">
              You are signing up <b>{staff.length}</b> staff members.
            </h3>
          </>
        )}
      </FloatingContainer>
    </>
  );
};

export default CreateStaff;
