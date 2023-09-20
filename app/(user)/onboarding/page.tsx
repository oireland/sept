"use client";
import { Button } from "@/components/ui/button";
import React, { useRef, useState } from "react";
import OnboardingForm from "./OnboardingForm";
import FloatingContainer from "@/components/FloatingContainer";

const Onboarding = () => {
  const [athletes, setAthletes] = useState<String[][]>();
  const [groups, setGroups] = useState<String[]>();
  const [teams, setTeams] = useState<String[]>();

  const [staff, setStaff] = useState<String[][]>();

  const onAthleteFileChange = (resultArray: string[]) => {
    const arrayOfAthletesSplit: string[][] = [];
    const groupsSet = new Set<String>();
    const teamsSet = new Set<String>();

    // TODO: validate each line
    resultArray.forEach((athlete) => {
      // format: name, group, team, email, boyOrGirl
      const athleteSplit = athlete.split(",");

      // do not add the athlete if it doesn't have the correct number of columns
      if (athleteSplit.length !== 5) {
        return;
      }

      groupsSet.add(athleteSplit[1]);
      teamsSet.add(athleteSplit[2]);
      arrayOfAthletesSplit.push(athleteSplit);
    });

    setAthletes(arrayOfAthletesSplit);

    setGroups(Array.from(groupsSet));
    setTeams(Array.from(teamsSet));

    console.log(arrayOfAthletesSplit);
    console.log(groupsSet);
    console.log(teamsSet);
  };

  const onStaffFileChange = (resultArray: string[]) => {};

  return (
    <>
      <FloatingContainer className="p-4">
        <h2 className="mt-2 text-center text-xl font-semibold text-brg">
          Sign up Athletes and Staff
        </h2>
        <OnboardingForm
          onAthleteFileChange={onAthleteFileChange}
          onStaffFileChange={onStaffFileChange}
        />

        {(groups || teams) && (
          <>
            <hr className="my-2" />

            <div className="flex space-x-1">
              <h3 className="mr-2">Groups:</h3>
              {groups?.map((group, index) => (
                <p
                  className="w-min rounded-xl bg-gray-200 p-1 text-sm"
                  key={index}
                >
                  {group}
                </p>
              ))}
            </div>

            <div className="mt-2 flex space-x-1">
              <h3 className="mr-2">Teams:</h3>
              {teams?.map((team, index) => (
                <p
                  className="w-min rounded-xl bg-gray-200 p-1 text-sm"
                  key={index}
                >
                  {team}
                </p>
              ))}
            </div>
          </>
        )}
      </FloatingContainer>
    </>
  );
};

export default Onboarding;
