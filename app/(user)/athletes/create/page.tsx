"use client";
import React, { useState } from "react";
import AthleteForm from "./AthleteForm";
import FloatingContainer from "@/components/FloatingContainer";
import InfoDialog from "./infoDialog";
import axios from "axios";
import getURL from "@/lib/getURL";
import { data } from "autoprefixer";

const CreateAthletes = () => {
  const [athletes, setAthletes] = useState<String[][]>();
  const [groups, setGroups] = useState<String[]>();
  const [teams, setTeams] = useState<String[]>();

  const onAthleteFileChange = (resultArray: string[]) => {
    const arrayOfAthletesSplit: string[][] = [];
    const groupsSet = new Set<String>();
    const teamsSet = new Set<String>();

    // TODO: validate each line
    resultArray.forEach((athlete) => {
      // format: name, email, group, team, boyOrGirl
      const athleteSplit = athlete.split(",");

      // do not add the athlete if it doesn't have the correct number of columns
      if (athleteSplit.length !== 5) {
        return;
      }

      groupsSet.add(athleteSplit[2]);
      teamsSet.add(athleteSplit[3]);

      arrayOfAthletesSplit.push(athleteSplit);
    });

    setAthletes(arrayOfAthletesSplit);

    setGroups(Array.from(groupsSet));
    setTeams(Array.from(teamsSet));
  };

  const onSubmit = async () => {
    console.log("onSubmit()");
    try {
      const res = await axios.post(getURL("/api/create/createManyAthletes"), {
        name: "john",
        email: "john@email.com",
        group: "year 12",
        team: "red",
        boyOrGirl: "BOY",
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <FloatingContainer className="p-4">
        <div className="flex items-center justify-between">
          <div></div>
          <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
            Sign up Athletes
          </h2>
          <InfoDialog />
        </div>
        <AthleteForm
          onAthleteFileChange={onAthleteFileChange}
          onSubmit={onSubmit}
        />

        {(groups || teams) && (
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
