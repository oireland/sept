import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  resultsToBeCreated: yup
    .array()
    .of(
      yup
        .object({
          athleteId: yup.string().required(),
          place: yup.number().required(),
          points: yup.number().required(),
          bestHeight: yup.number().required(),
        })
        .required(),
    )
    .required(),
  eventId: yup.string().required(),
});

export async function POST(req: Request) {
  try {
    const { eventId, resultsToBeCreated } = await requestSchema.validate(
      await req.json(),
    );

    const session = await getServerSession(authOptions);

    if (session?.user.role !== "STAFF") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    await prisma.result.createMany({
      data: resultsToBeCreated.map(
        ({ athleteId, bestHeight, place, points }) => ({
          athleteId,
          eventId,
          place,
          points,
          scores: [bestHeight],
        }),
      ),
    });
    return NextResponse.json("Successfully created high jump results");
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
