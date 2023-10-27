import { BoyOrGirl, EventType } from "@prisma/client";
import * as yup from "yup";

export const AthleteSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  group: yup.string().required(),
  team: yup.string().required(),
  boyOrGirl: yup.mixed<BoyOrGirl>().oneOf(Object.values(BoyOrGirl)).required(),
});

export const AthleteTableDataSchema = yup.object({
  userId: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().email().required(),
  team: yup.string().required(),
  group: yup.string().required(),
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
    .of(yup.mixed<BoyOrGirl>().oneOf(Object.values(BoyOrGirl)))
    .min(1, "Required")
    .required("Required"),
  groups: yup
    .array()
    .of(yup.string())
    .min(1, "You must choose at least 1 group")
    .required("Required"),
  maxNumberOfAthletes: yup
    .number()
    .integer()
    .min(2, "Must be at least 2")
    .integer("Must be a whole number")
    .required("Required"),
});

export const EventTableDataSchema = yup.object({
  name: yup.string().required(),
  group: yup.string().required(),
  boyOrGirl: yup.mixed<BoyOrGirl>().oneOf(Object.values(BoyOrGirl)),
  eventType: yup
    .mixed<EventType>()
    .oneOf(Object.values(EventType))
    .required("Required"),
  id: yup.string().required(),
  numberOfAthletes: yup.number().required(),
  maxNumberOfAthletes: yup.number().min(2).required("Required"),
});

export const ResultSchema = yup.object({
  athleteId: yup.string().required(),
  score: yup.number().required(),
});

export const ResultsInputSchema = yup.object({
  results: yup.array().of(ResultSchema).required(),
});
