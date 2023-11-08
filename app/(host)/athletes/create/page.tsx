"use client";
import React, { useState } from "react";
import SingleCsvForm from "../../../../components/SingleCsvForm";
import FloatingContainer from "@/components/FloatingContainer";
import InfoDialog from "./infoDialog";
import axios, { AxiosError } from "axios";
import getURL from "@/lib/getURL";
import * as yup from "yup";
import { AthleteSchema } from "@/lib/yupSchemas";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter, redirect } from "next/navigation";

type Athlete = yup.InferType<typeof AthleteSchema>;

const CreateAthletes = () => {
  const router = useRouter();

  const [athletes, setAthletes] = useState<Athlete[]>();
  const [groups, setGroups] = useState<String[]>();
  const [teams, setTeams] = useState<String[]>();

  const onAthleteFileChange = async (resultArray: string[]) => {
    let toastId = toast.loading("Loading file...");
    try {
      const groupsSet = new Set<String>();
      const teamsSet = new Set<String>();

      const unvalidatedAthleteObjectArray: {}[] = [];

      resultArray.forEach((athlete) => {
        // Prevents empty lines from throwing an error
        if (athlete === "") return;

        const athleteSplit = athlete.split(",");

        // do not add the athlete if it doesn't have the correct number of columns
        if (athleteSplit.length !== 5) {
          throw new Error("Invalid File Format");
        }

        groupsSet.add(athleteSplit[2]);
        teamsSet.add(athleteSplit[3]);

        // forming an object from the array so that it can be validated against the schema
        unvalidatedAthleteObjectArray.push({
          name: athleteSplit[0],
          email: athleteSplit[1],
          group: athleteSplit[2],
          team: athleteSplit[3],
          boyOrGirl: athleteSplit[4],
        });
      });

      const athletesObjectArray = await yup
        .array(AthleteSchema)
        .validate(unvalidatedAthleteObjectArray);

      if (athletesObjectArray?.length === 0) {
        throw new Error("No file selected");
      }

      setAthletes(athletesObjectArray);

      setGroups(Array.from(groupsSet));
      setTeams(Array.from(teamsSet));
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
      setGroups(undefined);
      setTeams(undefined);
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

        {groups && teams && (
          <>
            <hr className="my-2" />

            <h3 className="text-lg">
              You are signing up <b>{athletes?.length}</b> athletes.
            </h3>

            <div className="flex flex-col">
              <h3 className="mr-2">Your Groups:</h3>
              <div className="flex space-x-1">
                {groups?.map((group, index) => (
                  <p className="rounded-xl bg-gray-200 p-1 text-sm" key={index}>
                    {group}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-2 flex flex-col">
              <h3 className="mr-2">Your teams:</h3>
              <div className="flex space-x-1">
                {teams?.map((team, index) => (
                  <p className="rounded-xl bg-gray-200 p-1 text-sm" key={index}>
                    {team}
                  </p>
                ))}
              </div>
            </div>
          </>
        )}
      </FloatingContainer>
    </>
  );
};

export default CreateAthletes;
