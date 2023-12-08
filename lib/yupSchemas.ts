import { BoyOrGirl, EventType } from "@prisma/client";
import * as yup from "yup";

export const AthleteTableDataSchema = yup.object({
  userId: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  teamName: yup.string().required(),
  groupName: yup.string().required(),
  numberOfEvents: yup.number().required(),
  boyOrGirl: yup.mixed<BoyOrGirl>().oneOf(Object.values(BoyOrGirl)).required(),
});

export const StaffSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email("Email is invalid"),
});

export const StaffTableDataSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().required().email(),
  numberOfEvents: yup.number().required(),
});

export const EventValidationSchema = yup.object({
  eventName: yup.string().max(30, "Max 30 characters").required("Required"),
  eventType: yup
    .mixed<EventType>()
    .oneOf(Object.values(EventType))
    .required("Required"),
  boyOrGirl: yup
    .array()
    .of(yup.mixed<BoyOrGirl>().oneOf(Object.values(BoyOrGirl)).required())
    .min(1, "Required")
    .required("Required"),
  groupNames: yup
    .array()
    .of(yup.string().required())
    .min(1, "You must choose at least 1 group")
    .required("Required"),
  maxNumberOfAthletesPerTeam: yup
    .number()
    .integer()
    .min(1, "Must be at least 1 ")
    .integer("Must be a whole number")
    .required("Required"),
  date: yup
    .date()
    .required()
    .test(
      "futureDate",
      "Date must be in the future",
      (date) => new Date() < date,
    ),
  locationName: yup.string().required("Required"),
});

export const EventTableDataSchema = yup.object({
  eventFullName: yup.string().required("Name is required"),
  groupName: yup.string().required("Group name is required"),
  boyOrGirl: yup.mixed<BoyOrGirl>().oneOf(Object.values(BoyOrGirl)),
  eventId: yup.string().required(),
  numberOfAthletes: yup.number().required(),
  maxNumberOfAthletes: yup
    .number()
    .min(1)
    .required("Max number of athletes required"),
  recordString: yup.string().required(),
});

export const TrackResultSchema = yup
  .object({
    athleteId: yup.string().required(),
    time: yup.number().required().min(0, "Scores must not be negative"),
  })
  .required();

export const FieldResultSchema = yup
  .object({
    athleteId: yup.string().required(),
    distances: yup
      .array()
      .of(yup.number().required().min(0, "Scores must not be negative"))
      .required()
      .test("lengthIs3", (arr) => arr.length === 3),
  })
  .required();

export const TrackResultsInputSchema = yup.object({
  results: yup.array().of(TrackResultSchema).required(),
});

export const FieldResultsInputSchema = yup.object({
  results: yup.array().of(FieldResultSchema).required(),
});

export enum AttemptOptions {
  CLEARED = "CLEARED",
  PASSED = "PASSED",
  FAILED = "FAILED",
}

export const HighJumpResultSchema = yup.object({
  athleteId: yup.string().required(),

  attemptsAtEachHeight: yup
    .array()
    .of(
      yup
        .array()
        .of(yup.mixed<AttemptOptions>().oneOf(Object.values(AttemptOptions))),
    )
    .required(),
});

export const HighJumpResultsInputSchema = yup.object({
  results: yup
    .array()
    .of(HighJumpResultSchema)
    .required("results are required"),
  heights: yup.array().of(yup.number().required().min(0)).required(),
});
