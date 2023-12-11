import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import * as yup from "yup";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    const allowedEventIds = (
      await prisma.event.findMany({
        where: {
          host: {
            userId: session.user.userId,
          },
        },
        select: {
          eventId: true,
        },
      })
    ).map(({ eventId }) => eventId);

    console.log("allowedEventIds", allowedEventIds);

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
          .min(1800)
          .max(new Date().getUTCFullYear())
          .required(),
        recordScore: yup.number().required().min(0),
      })
      .required();

    const requestSchema = yup.object({
      records: yup.array().of(RecordSchema).required(),
    });

    const { records } = await requestSchema.validate(await req.json());

    await Promise.all(
      records.map(({ eventId, recordHolderName, yearRecordSet, recordScore }) =>
        prisma.event.update({
          where: {
            eventId,
          },
          data: {
            recordHolderName,
            yearRecordSet,
            recordScore,
          },
        }),
      ),
    );

    return NextResponse.json("Records Added to Event Successfully");
  } catch (e) {
    console.log(e);
    if (e instanceof yup.ValidationError) {
      return NextResponse.json("Invalid Request", { status: 400 });
    }
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
