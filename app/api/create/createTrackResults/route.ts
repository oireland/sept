import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { TrackResultSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  results: yup.array().of(TrackResultSchema).required(),
  eventId: yup.string().required(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "STAFF") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    let { results, eventId } = await requestSchema.validate(await req.json());

    const hostId = await getHostId(session.user.userId, session.user.role);
    if (hostId === null) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // select the required event data and remove previously entered results
    const {
      hostId: eventHostId,
      eventType,
      maxNumberOfAthletesPerTeam,
      staffMember,
      host,
      athletesCompeting,
      recordScore,
    } = await prisma.event.update({
      where: {
        eventId,
      },
      select: {
        hostId: true,
        eventType: true,
        maxNumberOfAthletesPerTeam: true,
        host: {
          select: {
            teams: true,
          },
        },
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
        staffMember: {
          select: {
            userId: true,
          },
        },
        recordScore: true,
      },
      data: {
        results: {
          deleteMany: {},
        },
      },
    });

    const maxNumberOfAthletes = maxNumberOfAthletesPerTeam * host.teams.length;

    if (eventType !== "TRACK") {
      return NextResponse.json("Incorrect Event Type", { status: 400 });
    }

    if (staffMember?.userId !== session.user.userId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    if (hostId !== eventHostId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // get athletes with 0 as their score to remove them from the event
    const athletesWithZeroTimeIds = results
      .filter(({ time }) => {
        time === 0;
      })
      .map(({ athleteId }) => athleteId);

    // remove results with wrong numberOfAttempts, or all attempts are 0.
    results = results.filter(({ time }) => time !== 0);

    // sort athletes low to high time
    results.sort((a, b) => a.time - b.time);

    const resultsToBeCreated: {
      athleteId: string;
      eventId: string;
      place: number;
      points: number;
      scores: number[];
    }[] = [];

    let placeAdjustment = 0;
    // used to give same place and points in the case of a draw. It is incremented when there is a draw, and because it is subtracted from the place and added to the points when adding to the array, the athletes that draw receieve the same.

    for (let i = 0; i < results.length - 1; i++) {
      const current = results[i];
      const next = results[i + 1];

      resultsToBeCreated.push({
        athleteId: current.athleteId,
        eventId,
        place: i + 1 - placeAdjustment,
        points: maxNumberOfAthletes - i + placeAdjustment,
        scores: [current.time],
      });

      if (current.time === next.time) {
        // draw
        placeAdjustment++; // end of "draw streak" so reset
      } else {
        // end of "draw streak" if there is one
        placeAdjustment = 0;
      }
    }

    // add the last athlete
    if (results.length > 0) {
      // add the last athlete to the list
      let lastAthlete = results[results.length - 1];
      resultsToBeCreated.push({
        athleteId: lastAthlete.athleteId,
        scores: [lastAthlete.time],
        eventId,
        place: results.length - placeAdjustment,
        points: maxNumberOfAthletes - results.length + 1 + placeAdjustment,
      });
    }

    // create results for athletes who competed
    await prisma.result.createMany({
      data: resultsToBeCreated,
    });

    // remove the event from athletes who didn't compete (all 0s)

    athletesWithZeroTimeIds.forEach(
      async (athleteId) =>
        await prisma.athlete.update({
          where: { athleteId },
          data: {
            events: {
              disconnect: {
                eventId,
              },
            },
          },
        }),
    );

    // check for record broken
    if (recordScore === null || results[0].time < recordScore) {
      const recordBreaker = results[0];
      // update record
      await prisma.event.update({
        where: {
          eventId,
        },
        data: {
          recordScore: recordBreaker.time,
          recordHolderName: athletesCompeting.filter(
            ({ athleteId }) => athleteId === recordBreaker.athleteId,
          )[0].user.name,
          yearRecordSet: new Date().getFullYear(),
        },
      });
    }

    return NextResponse.json("Results created successfully", { status: 200 });
  } catch (e) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
