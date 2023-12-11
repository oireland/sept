"use client";

import { FieldAttributes, Form, Formik, useField } from "formik";
import { FC, useState } from "react";

import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import { HighJumpResultsInputSchema } from "@/lib/yupSchemas";
import axios, { AxiosError } from "axios";
import { Check, PlusCircle, Trophy, X } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import getURL from "@/lib/getURL";

type CalculatedResult = {
  athleteId: string;
  place: number;
  points: number;
  bestHeight: number;
};

type AttemptOptions = "CLEARED" | "PASSED" | "FAILED" | undefined;

type Result = {
  athleteId: string;
  attemptsAtEachHeight: AttemptOptions[][];
};

type FormData = {
  results: Result[];
  heights: number[];
};

type Props = {
  athletes: { athleteId: string; name: string }[];
  eventId: string;
  maxNumberOfAthletesTotal: number;
};

const HighJumpResultsForm: FC<Props> = ({
  athletes,
  eventId,
  maxNumberOfAthletesTotal,
}) => {
  const [athletesInJumpOffIds, setAthletesInJumpOffIds] = useState<string[]>(
    [],
  );
  const [calculatedResults, setCalculatedResults] = useState<
    CalculatedResult[]
  >([]);

  const router = useRouter();

  if (typeof window !== "undefined") {
    window.onbeforeunload = () => {
      return "Confirm page reload. Unsaved results will be lost";
    };
  }

  const finalResultSubmission = async (
    resultsToBeCreated: CalculatedResult[],
  ) => {
    let toastId = toast.loading("Saving...");
    try {
      await axios.post(getURL("/api/create/createHighJumpResults"), {
        resultsToBeCreated,
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

  // Changes the place and points of every athlete in the jump off apart from the winner to 2nd place and the corresponding number of points.
  const selectWinner = async (winnerId: string) => {
    let resultsToBeCreated: CalculatedResult[] = calculatedResults.map(
      (athlete) => {
        if (
          athletesInJumpOffIds.includes(athlete.athleteId) &&
          athlete.athleteId !== winnerId
        ) {
          return {
            athleteId: athlete.athleteId,
            bestHeight: athlete.bestHeight,
            place: 2,
            points: maxNumberOfAthletesTotal - 1,
          };
        }

        return athlete;
      },
    );

    await finalResultSubmission(resultsToBeCreated);
  };

  // The "JUMP OFF" - displays a button for each athlete in the jump off for the staff member to select who won. Or they can choose to share the gold.
  if (athletesInJumpOffIds.length > 1) {
    return (
      <div className="p-2 sm:p-4 md:p-6">
        <h3 className="text-base font-semibold text-center">
          Select the winner of the jump off:
        </h3>
        <div className="flex flex-col space-y-1 my-2 w-fit justify-center mx-auto">
          {athletesInJumpOffIds.map((id) => {
            let name = athletes.filter(({ athleteId }) => athleteId === id)[0]
              .name;
            return (
              <Button
                onClick={async () => {
                  await selectWinner(id);
                }}
                key={id}
                variant="outline"
                className="w-full"
              >
                {name}
              </Button>
            );
          })}
        </div>
        <div className="w-full flex items-center space-x-2 my-2 justify-evenly">
          <hr className="text-black w-full" />
          <span>OR</span>
          <hr className="text-black w-full" />
        </div>
        <div className="w-full flex items-center justify-center">
          <Button
            variant="outline"
            className="mx-auto"
            onClick={async () => await finalResultSubmission(calculatedResults)}
          >
            Share the Gold!
            <Trophy className="text-[#FFD700]" />
          </Button>
        </div>
      </div>
    );
  }

  {
    /* Called when the results form is submitted with valid data. Calls the method to calculate the points and place for each athlete.
  Updates the athletes in the jump off if one is needed, otherwise the final submission is performed - POST request to create the results in the DB*/
  }
  const handleFormSubmit = async (data: FormData) => {
    try {
      const { athletesInJumpOff, results } = calculateResults(
        data,
        maxNumberOfAthletesTotal,
      );
      if (athletesInJumpOff.length > 1) {
        setAthletesInJumpOffIds(athletesInJumpOff);
        setCalculatedResults(results);
      } else {
        await finalResultSubmission(results);
      }
    } catch (e) {
      console.log("Error in handleFormSubmit - high jump form", e);
    }
  };

  const initialValues: FormData = {
    results: athletes.map(({ athleteId }) => ({
      athleteId,

      attemptsAtEachHeight: [[], [], []],
    })),
    heights: [0, 0, 0],
  };

  // Main results form

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={HighJumpResultsInputSchema}
      onSubmit={(values: FormData) => {
        handleFormSubmit(values);
        console.log(values);
      }}
    >
      {({ values, setValues }) => (
        <Form className="p-2 sm:p-4 md:p-6">
          <div className="grid grid-cols-4">
            <div></div>
            <header className="col-span-3 border  flex items-center justify-between rounded-t-md px-2 font-semibold  bg-muted">
              <div className="text-center w-full text-sm lg:text-base py-2 ">
                Heights (m)
              </div>
              <PlusCircle
                className="w-5 h-5 cursor-pointer"
                onClick={() => {
                  let oldVals = values;
                  oldVals.results.forEach(({ attemptsAtEachHeight }) =>
                    attemptsAtEachHeight.push([]),
                  );
                  setValues({
                    results: values.results,
                    heights: [...values.heights, 0],
                  });
                }}
              />
            </header>
            <div>
              <header className=" border  h-10 flex items-center  rounded-tl-md px-2 font-semibold  bg-muted">
                <div className="text-center w-full text-sm lg:text-base py-2 ">
                  Names
                </div>
              </header>
              {athletes.map(({ name, athleteId }) => (
                <div
                  key={athleteId}
                  className=" border-b border-x  h-10 flex items-center  px-2"
                >
                  <div className="text-center w-full text-xs lg:text-sm py-2 ">
                    {name}
                  </div>
                </div>
              ))}
            </div>

            <div className="col-span-3 overflow-x-scroll overflow-y-hidden">
              {/* Display an input for every height added, which update's that height's value */}
              <div className="flex h-10">
                {values.heights.map((height, index) => (
                  <HeightInput key={index} index={index} name="heights" />
                ))}
              </div>

              {/* Display a result input "row" for each athlete */}
              <div>
                {athletes.map(({ name, athleteId }, index) => (
                  <AthleteResultsInput
                    athleteIndex={index}
                    key={athleteId}
                    name="results"
                    heights={values.heights}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <BackButton />
            <Button type="submit" variant={"form"}>
              Save
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default HighJumpResultsForm;

type HeightInputProps = {
  index: number;
} & FieldAttributes<{}>;

const HeightInput: FC<HeightInputProps> = ({ index, ...props }) => {
  const [field, meta, helpers] = useField<number[]>(props.name);

  const { value } = meta;
  const { setValue } = helpers;

  const [fieldValue, setFieldValue] = useState("");

  return (
    <input
      type="text"
      step={0.01}
      min={index === 0 ? 0 : value[index - 1] + 0.01} // height must be greater than or equal to the previous height
      name={field.name}
      onBlur={field.onBlur}
      onChange={(e) => {
        let targetVal = e.currentTarget.value;
        if (!targetVal) {
          targetVal = "0";
        }
        // test that the entered value won't be NaN
        if (/^(\d+\.?\d*)$/.test(targetVal)) {
          let numberValue =
            Math.trunc(Number(e.currentTarget.value) * 100) / 100;
          let newValue = value;
          newValue[index] = numberValue;
          setValue(newValue);

          // append a decimal point if there was one in the entered string
          if (targetVal.endsWith(".")) {
            setFieldValue(numberValue + ".");
          } else {
            setFieldValue(numberValue.toString());
          }
        }
      }}
      className="flex w-full h-10 border-b border-r bg-background px-3 py-2 text-xs min-w-[120px]"
      // value={fieldValue.replace(/^0+/, "")}
      value={fieldValue}
    />
  );
};

type AthleteResultInputProps = {
  athleteIndex: number;
  heights: number[];
} & FieldAttributes<{}>;

const AthleteResultsInput: FC<AthleteResultInputProps> = ({
  athleteIndex,
  heights,
  ...props
}) => {
  const [field, meta, helpers] = useField<Result[]>(props.name);

  const value = meta.value;
  const thisAthletesValue = value[athleteIndex];
  const { setValue } = helpers;

  const toggleAttempt = (heightIndex: number, attemptIndex: number) => {
    let tempValue = value;

    // rotate between the 4 possible "states" of the button
    switch (thisAthletesValue.attemptsAtEachHeight[heightIndex][attemptIndex]) {
      case "CLEARED":
        tempValue[athleteIndex].attemptsAtEachHeight[heightIndex][
          attemptIndex
        ] = "FAILED";
        setValue(tempValue);
        break;
      case "FAILED":
        tempValue[athleteIndex].attemptsAtEachHeight[heightIndex][
          attemptIndex
        ] = "PASSED";
        setValue(tempValue);
        break;
      case "PASSED":
        tempValue[athleteIndex].attemptsAtEachHeight[heightIndex][
          attemptIndex
        ] = undefined;

        setValue(tempValue);
        break;

      default:
        tempValue[athleteIndex].attemptsAtEachHeight[heightIndex][
          attemptIndex
        ] = "CLEARED";
        setValue(tempValue);

        break;
    }
  };

  const isButtonDisabled = (heightIndex: number, attemptIndex: number) => {
    // if there has not been a height entered then disabled
    if (heights[heightIndex] === 0) {
      return true;
    }
    // if a field has a value then it mustn't be disabled
    if (
      thisAthletesValue.attemptsAtEachHeight[heightIndex][attemptIndex] !==
      undefined
    ) {
      return false;
    }

    // if first attempt at first height then not disabled
    if (heightIndex === 0 && attemptIndex === 0) {
      return false;
    }

    // if it is the first attempt at a height
    if (attemptIndex === 0) {
      // if the previous attempt has a pass or a cleared then not disabled
      if (
        thisAthletesValue.attemptsAtEachHeight[heightIndex - 1].includes(
          "CLEARED",
        ) ||
        thisAthletesValue.attemptsAtEachHeight[heightIndex - 1].includes(
          "PASSED",
        )
      ) {
        return false;
      }
    }

    // if the previous attempt is a fail then not disabled
    if (
      thisAthletesValue.attemptsAtEachHeight[heightIndex][attemptIndex - 1] ===
      "FAILED"
    ) {
      return false;
    }

    // the button should be disabled
    return true;
  };

  return (
    <>
      <div className=" flex">
        {heights.map(({}, heightIndex) => {
          const attempts = thisAthletesValue.attemptsAtEachHeight[heightIndex];
          return (
            <div key={heightIndex} className=" flex justify-evenly w-full">
              {Array.from(Array(3)).map((v, attemptIndex) => (
                <div
                  key={"attempt" + attemptIndex}
                  className=" w-full border-r border-b h-10 min-w-[40px]"
                >
                  <Button
                    type="button"
                    onClick={() => toggleAttempt(heightIndex, attemptIndex)}
                    className="w-full h-full p-0 border-0"
                    disabled={isButtonDisabled(heightIndex, attemptIndex)}
                  >
                    {attempts[attemptIndex] === "CLEARED" ? (
                      <Check className="h-4 w-4" />
                    ) : attempts[attemptIndex] === "FAILED" ? (
                      <X className="text-red-700 h-4 w-4" />
                    ) : attempts[attemptIndex] === "PASSED" ? (
                      "P"
                    ) : null}
                  </Button>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
};

const calculateResults = (formData: FormData, maxNumberOfAthletes: number) => {
  const { heights, results: resultsData } = formData;

  let winningHeight = 0;

  const calculatedResults = resultsData.map(
    ({ attemptsAtEachHeight, athleteId }) => {
      let bestHeight = 0;
      let failsAtBestHeight = 0;
      attemptsAtEachHeight.forEach((value, index) => {
        if (value?.includes("CLEARED")) {
          bestHeight = heights[index];

          failsAtBestHeight = value.filter(
            (attempt) => attempt === "FAILED",
          ).length;
        }
      });
      winningHeight = Math.max(winningHeight, bestHeight);

      let totalFails = 0;
      attemptsAtEachHeight?.flat(1).forEach((value) => {
        if (value === "FAILED") {
          totalFails++;
        }
      });

      return {
        athleteId,
        bestHeight,
        totalFails,
        attemptsAtEachHeight,
        failsAtBestHeight,
      };
    },
  );

  let athletesInJumpOff: string[] = []; // athleteId of the athlete
  calculatedResults.sort((a, b) => {
    if (a.bestHeight === b.bestHeight) {
      // Tie breaker if winning height
      if (a.bestHeight === winningHeight) {
        // 1. Fewest failed attempts at height which tie occured
        if (a.failsAtBestHeight < b.failsAtBestHeight) {
          // put a in front
          return -1;
        } else if (b.failsAtBestHeight < a.failsAtBestHeight) {
          // put b in front
          return 1;
        } else {
          // 2. Fewest failed attempts throughout the competition
          if (a.totalFails < b.totalFails) {
            return -1;
          } else if (b.totalFails < a.totalFails) {
            return 1;
          }
          //  Jump Off Required
          athletesInJumpOff.push(a.athleteId, b.athleteId);

          return 0;
        }
      } else {
        return 0;
      }
    }

    return b.bestHeight - a.bestHeight;
  }); // high to low

  // remove duplicates
  athletesInJumpOff = Array.from(new Set(athletesInJumpOff));

  let results: CalculatedResult[] = [];

  let placeAdjustment = 0;

  for (let i = 0; i < calculatedResults.length - 1; i++) {
    const current = calculatedResults[i];
    const next = calculatedResults[i + 1];
    // if there are no athletes in the jump off then the first athlete is the winner. Need to do this seperately because the condition below for a draw will be met event if the tie breaker has been resolved and there is no jump off.
    if (athletesInJumpOff.length === 0 && i === 0) {
      results.push({
        athleteId: current.athleteId,
        bestHeight: current.bestHeight,
        place: 1,
        points: maxNumberOfAthletes,
      });
      continue;
    }

    if (athletesInJumpOff.includes(current.athleteId)) {
      // current athlete is in joint first with at least one other person
      results.push({
        athleteId: current.athleteId,
        bestHeight: current.bestHeight,
        place: 1,
        points: maxNumberOfAthletes,
      });
      continue;
    }

    // no athlete who "reaches this point" is in joint first, so bestHeights can be compared
    if (current.bestHeight === next.bestHeight) {
      // draw
      results.push({
        athleteId: current.athleteId,
        bestHeight: current.bestHeight,
        place: i - placeAdjustment + 1,
        points: maxNumberOfAthletes - i + placeAdjustment,
      });
      placeAdjustment++; // to give next athlete same points
      continue;
    }

    // current athlete did better
    results.push({
      athleteId: current.athleteId,
      bestHeight: current.bestHeight,
      place: i - placeAdjustment + 1,
      points: maxNumberOfAthletes - i + placeAdjustment,
    });
    placeAdjustment = 0;
    continue;
  }

  const lastResult = calculatedResults[calculatedResults.length - 1];
  if (athletesInJumpOff.includes(lastResult.athleteId)) {
    // for silly edge case where every athlete is in the jump off
    results.push({
      athleteId: lastResult.athleteId,
      bestHeight: lastResult.bestHeight,
      place: 1,
      points: maxNumberOfAthletes,
    });
  } else {
    results.push({
      athleteId: lastResult.athleteId,
      bestHeight: lastResult.bestHeight,
      place: calculatedResults.length - placeAdjustment,
      points:
        maxNumberOfAthletes - calculatedResults.length + placeAdjustment + 1,
    });
  }

  return {
    results,
    athletesInJumpOff,
  };
};
