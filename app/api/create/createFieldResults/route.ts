import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { FieldResultSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  results: yup.array().of(FieldResultSchema).required(),
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
      recordScore,
      athletesCompeting,
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

    if (eventType !== "FIELD") {
      return NextResponse.json("Invalid Event Type", { status: 400 });
    }

    if (staffMember?.userId !== session.user.userId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    if (hostId !== eventHostId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // sort attempts from best to worst
    results.forEach(({ distances }) => {
      distances.sort((a, b) => b - a); // high-low
    });

    // get results with all attempts being 0. If their highest attemot is zero they are all zero since it is sorted high to low
    // Need to remove them from the event so that all athletes competing have a result.
    const athletesWithAllZero = results
      .filter(({ distances }) => {
        distances.length !== 3 || distances[0] === 0;
      })
      .map(({ athleteId }) => athleteId);

    // remove results with wrong numberOfAttempts, or best attempt 0.
    results = results.filter(
      ({ distances }) => distances.length === 3 && distances[0] !== 0,
    );

    let drawPairsIds = new Map<string, string>();
    results.sort((a, b) => {
      for (let i = 0; i < 3; i++) {
        if (a.distances[i] > b.distances[i]) {
          // a is a better score so don't swap
          return -1;
        }
        if (a.distances[i] < b.distances[i]) {
          // b is a better score so swap
          return 1;
        }
      }
      // all attempts were the same so it will end up being a draw. Maintain the order
      drawPairsIds.set(a.athleteId, b.athleteId);

      return 0;
    });

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

      // add the current athlete
      resultsToBeCreated.push({
        athleteId: current.athleteId,
        eventId,
        place: i + 1 - placeAdjustment,
        points: maxNumberOfAthletes - i + placeAdjustment,
        scores: current.distances,
      });

      if (
        drawPairsIds.get(current.athleteId) === next.athleteId ||
        drawPairsIds.get(next.athleteId) === current.athleteId
      ) {
        // if the current and next athlete drew
        placeAdjustment++;
      } else {
        placeAdjustment = 0; // end of "draw streak" so reset
      }
    }

    // add the last athlete
    if (results.length > 0) {
      // add the last athlete to the list
      let lastAthlete = results[results.length - 1];
      resultsToBeCreated.push({
        athleteId: lastAthlete.athleteId,
        scores: lastAthlete.distances,
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
    await Promise.all(
      athletesWithAllZero.map((athleteId) =>
        prisma.athlete.update({
          where: { athleteId },
          data: {
            events: {
              disconnect: {
                eventId,
              },
            },
          },
        }),
      ),
    );

    // check for record broken
    if (recordScore === null || results[0].distances[0] > recordScore) {
      const recordBreaker = results[0];
      // update record
      await prisma.event.update({
        where: {
          eventId,
        },
        data: {
          recordScore: recordBreaker.distances[0],
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
