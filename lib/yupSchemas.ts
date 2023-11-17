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
  email: yup.string().required().email(),
});

export const StaffTableDataSchema = yup.object({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().required().email(),
  numberOfEvents: yup.number().required(),
});

export const EventValidationSchema = yup.object({
  eventName: yup.string().max(30, "Max 30 characters").required("Required"),
  trackOrField: yup
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
  maxNumberOfAthletes: yup
    .number()
    .integer()
    .min(2, "Must be at least 2")
    .integer("Must be a whole number")
    .required("Required"),
  numberOfAttempts: yup
    .number()
    .integer()
    .min(1, "Must be at least 1")
    .integer("Must be a whole number")
    .required("Required"),
  date: yup
    .date()
    .required()
    .test(
      "futureDate",
      "Date must be in the future",
      (date) => new Date() < date
    ),
  locationName: yup.string().required("Required"),
});

export const EventTableDataSchema = yup.object({
  name: yup.string().required(),
  group: yup.string().required(),
  boyOrGirl: yup.mixed<BoyOrGirl>().oneOf(Object.values(BoyOrGirl)),
  eventType: yup
    .mixed<EventType>()
    .oneOf(Object.values(EventType))
    .required("Required"),
  eventId: yup.string().required(),
  numberOfAthletes: yup.number().required(),
  maxNumberOfAthletes: yup.number().min(2).required("Required"),
});

export const ResultSchema = yup.object({
  athleteId: yup.string().required(),
  scores: yup
    .array()
    .of(yup.number().required().min(0, "Scores must not be negative"))
    .required(),
});

export const ResultsInputSchema = yup.object({
  results: yup.array().of(ResultSchema).required(),
});
