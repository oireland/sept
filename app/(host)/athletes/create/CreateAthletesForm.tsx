"use client";
import React, { useState } from "react";
import SingleCsvForm from "../../../../components/SingleCsvForm";
import FloatingContainer from "@/components/FloatingContainer";
import InfoDialog from "./infoDialog";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import * as yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { BoyOrGirl } from "@prisma/client";

type Props = {
  allowedGroups: string[];
  allowedTeams: string[];
};

const CreateAthletesForm = ({ allowedGroups, allowedTeams }: Props) => {
  const router = useRouter();

  const AthleteSchema = yup
    .object({
      name: yup.string().required("1st column (name) is required"),
      email: yup
        .string()
        .required("2nd colummn (email) is required")
        .email(
          "At least one of the email addresses in the 2nd column is not valid.",
        ),
      groupName: yup
        .string()
        .required("3rd column (group) is required")
        .test(
          "isAllowedGroup",
          "At least one of the groups in your file (3rd column) isn't a group you've added.",
          (group) => {
            return allowedGroups.includes(group);
          },
        ),
      teamName: yup
        .string()
        .required("4th column (team) is required")
        .test(
          "isAllowedTeam",
          "At least one of the teams in your file (4th column) isn't a team you've added.",
          (team) => {
            return allowedTeams.includes(team);
          },
        ),
      boyOrGirl: yup
        .mixed<BoyOrGirl>()
        .oneOf(
          Object.values(BoyOrGirl),
          "5th column values must be BOY or GIRL",
        )
        .required("5th column (BOY or GIRL) is required"),
    })
    .required();

  type Athlete = yup.InferType<typeof AthleteSchema>;

  const [athletes, setAthletes] = useState<Athlete[]>();

  const onAthleteFileChange = async (resultArray: string[]) => {
    let toastId = toast.loading("Loading file...");
    try {
      const unvalidatedAthleteObjectArray: {}[] = [];

      resultArray.forEach((athlete) => {
        // Prevents empty lines from causing an error
        if (athlete === "") return;

        const athleteSplit = athlete.split(",");

        // forming an object from the array so that it can be validated against the schema
        unvalidatedAthleteObjectArray.push({
          name: athleteSplit[0],
          email: athleteSplit[1],
          groupName: athleteSplit[2],
          teamName: athleteSplit[3],
          boyOrGirl: athleteSplit[4],
        });
      });

      const athletesObjectArray = await yup
        .array(AthleteSchema)
        .required()
        .min(1)
        .validate(unvalidatedAthleteObjectArray);

      setAthletes(athletesObjectArray);

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
      setAthletes(undefined);
    }
  };

  const onSubmit = async () => {
    let toastId = toast.loading("Submitting...");
    try {
      if (!athletes) {
        throw new Error("Please upload a valid file");
      }

      await axios.post(getURL("/api/create/createManyAthletes"), {
        athletes,
      });
      toast.dismiss(toastId);
      toastId = toast.success("Athletes created successfully");
      router.push("/athletes");
    } catch (e) {
      toast.dismiss(toastId);
      if (e instanceof Error || e instanceof AxiosError) {
        toast.error(e.message);
      } else {
        toastId = toast.error("Something went wrong");
      }
    }
  };

  return (
    <>
      <FloatingContainer>
        <div className="flex items-center justify-between">
          <div></div>
          <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
            Sign up Athletes
          </h2>
          <InfoDialog />
        </div>
        <SingleCsvForm
          onFileChange={onAthleteFileChange}
          onSubmit={onSubmit}
          inputLabel="Athletes"
          inputName="athleteInput"
        />

        {athletes && (
          <h3 className="text-lg">
            You are signing up <b>{athletes?.length}</b> athletes.
          </h3>
        )}
      </FloatingContainer>
    </>
  );
};

export default CreateAthletesForm;
