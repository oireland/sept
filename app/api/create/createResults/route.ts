import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { ResultSchema, ResultsInputSchema } from "@/lib/yupSchemas";
import { EventType, Result } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  results: yup.array().of(ResultSchema).required(),
  eventId: yup.string().required(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user.role === "STAFF")) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    const data = await requestSchema.validate(await req.json());

    const { results, eventId } = data;

    const hostId = await getHostId(session.user.id, session.user.role);
    if (hostId === null) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // select the required event data and remove previously entered results
    const {
      hostId: eventHostId,
      eventType,
      maxNumberOfAthletes,
      staffMember,
    } = await prisma.event.update({
      where: {
        id: eventId,
      },
      select: {
        hostId: true,
        eventType: true,
        maxNumberOfAthletes: true,
        staffMember: {
          select: {
            userId: true,
          },
        },
      },
      data: {
        results: {
          deleteMany: {},
        },
      },
    });

    if (staffMember?.userId !== session.user.id) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    if (hostId !== eventHostId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // order the results with lowest score first in the list
    results.sort((a, b) => a.score - b.score);

    // in field events a higher score is better
    if (eventType === "FIELD") {
      results.reverse();
    }

    const resultsToBeCreated = results.map(({ athleteId }, index) => ({
      athleteId,
      eventId,
      place: index + 1,
      points: maxNumberOfAthletes - index,
    }));

    await prisma.result.createMany({
      data: resultsToBeCreated,
    });

    return NextResponse.json("Successfully created results", { status: 200 });
  } catch (e) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
