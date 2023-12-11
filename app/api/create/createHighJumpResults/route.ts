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

    // Error will be thrown if there is no event where the host of the event has a staff member with the user id of current user. Get the record score to check for a broken record
    const { recordScore, athletesCompeting } =
      await prisma.event.findUniqueOrThrow({
        where: {
          host: {
            is: {
              staff: {
                some: {
                  userId: session.user.userId,
                },
              },
            },
          },
          eventId,
        },
        select: {
          recordScore: true,
          athletesCompeting: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
              athleteId: true,
            },
          },
        },
      });

    // create the results
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

    // check for record broken
    if (
      recordScore === null ||
      resultsToBeCreated[0].bestHeight > recordScore
    ) {
      const recordBreaker = resultsToBeCreated[0];
      // update record
      await prisma.event.update({
        where: {
          eventId,
        },
        data: {
          recordScore: recordBreaker.bestHeight,
          recordHolderName: athletesCompeting.filter(
            ({ athleteId }) => athleteId === recordBreaker.athleteId,
          )[0].user.name,
          yearRecordSet: new Date().getFullYear(),
        },
      });
    }

    return NextResponse.json("Successfully created high jump results");
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
