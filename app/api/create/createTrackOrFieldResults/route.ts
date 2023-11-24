import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { TrackOrFieldResultSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  results: yup.array().of(TrackOrFieldResultSchema).required(),
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
      numberOfAttempts,
      host,
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
        staffMember: {
          select: {
            userId: true,
          },
        },
        numberOfAttempts: true,
      },
      data: {
        results: {
          deleteMany: {},
        },
      },
    });
    const maxNumberOfAthletes = maxNumberOfAthletesPerTeam * host.teams.length;

    if (staffMember?.userId !== session.user.userId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    if (hostId !== eventHostId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // sort attempts from best to worst
    results.forEach(({ scores }) => {
      if (eventType === "TRACK") {
        scores.sort((a, b) => a - b); // low-high
      } else {
        scores.sort((a, b) => b - a); // high-low
      }
    });

    // get results with all attempts being 0.
    // Need to remove them from the event so that all athletes competing have a result.
    const athletesWithAllZero = results
      .filter(({ scores }) => {
        let areAllZero = true;
        scores.forEach((score) => {
          if (score !== 0) {
            areAllZero = false;
          }
        });
        return areAllZero;
      })
      .map(({ athleteId }) => athleteId);

    // remove results with wrong numberOfAttempts, or all attempts are 0.
    results = results.filter(
      ({ scores }) =>
        scores.length === numberOfAttempts &&
        scores[eventType === "TRACK" ? numberOfAttempts - 1 : 0] !== 0,
    );

    console.log("results before sort", results);

    // sort athletes best to worst based on their best attempt
    if (eventType === "TRACK") {
      results = results.sort((a, b) => {
        if (a.scores[0] < b.scores[0]) {
          // a is a better score so don't swap
          return -1;
        }
        if (a.scores[0] > b.scores[0]) {
          // b is a better score so swap
          return 1;
        }
        // best attempts are the same
        if (numberOfAttempts === 1 || a.scores[1] === b.scores[1]) {
          // this will end up being a draw, just maintain the order and the draw will be sorted later
          return 0;
        }

        if (a.scores[1] < b.scores[1]) {
          // a has better second best attempt so don't swap
          return -1;
        }
        // b has better second attempt so swap
        return 1;
      }); // low-high
    } else {
      results = results.sort((a, b) => {
        if (a.scores[0] > b.scores[0]) {
          // a is a better score so don't swap
          return -1;
        }
        if (a.scores[0] < b.scores[0]) {
          // b is a better score so swap
          return 1;
        }
        // best attempts are the same
        if (numberOfAttempts === 1 || a.scores[1] === b.scores[1]) {
          // this will end up being a draw, just maintain the order and the draw will be sorted later
          return 0;
        }

        if (a.scores[1] > b.scores[1]) {
          // a has better second best attempt so don't swap
          return -1;
        }
        // b has better second attempt so swap
        return 1;
      });
    }

    console.log("results after sort", results);

    const resultsToBeCreated: {
      athleteId: string;
      eventId: string;
      place: number;
      points: number;
      scores: number[];
    }[] = [];

    let currentIndex = 0;
    let placeAdjustment = 0;
    // used to give same place and points in the case of a draw. It is incremented when there is a draw, and because it is subtracted from the place and added to the points when adding to the array, the athletes that draw receieve the same.

    while (currentIndex < results.length - 1) {
      const current = results[currentIndex];
      const next = results[currentIndex + 1];

      if (current.scores[0] !== next.scores[0]) {
        // current athlete did better
        resultsToBeCreated.push({
          athleteId: current.athleteId,
          eventId,
          place: currentIndex + 1 - placeAdjustment,
          points: maxNumberOfAthletes - currentIndex + placeAdjustment,
          scores: current.scores,
        });
        currentIndex++;
        placeAdjustment = 0; // end of "draw streak" so reset
        continue;
      }
      // a draw if only 1 attempt or second attempt the same
      if (numberOfAttempts === 1 || current.scores[1] === next.scores[1]) {
        resultsToBeCreated.push({
          athleteId: current.athleteId,
          eventId,
          place: currentIndex + 1 - placeAdjustment,
          points: maxNumberOfAthletes - currentIndex + placeAdjustment,
          scores: current.scores,
        });
        currentIndex++;
        placeAdjustment++;

        continue;
      }

      // current athlete did better
      resultsToBeCreated.push({
        athleteId: current.athleteId,
        eventId,
        place: currentIndex + 1 - placeAdjustment,
        points: maxNumberOfAthletes - currentIndex + placeAdjustment,
        scores: current.scores,
      });
      currentIndex++;
      placeAdjustment = 0; // end of "draw streak" so reset
      continue;
    }

    // add the last athlete
    if (results[currentIndex]) {
      // add the last athlete to the list
      let lastAthlete = results[currentIndex];
      resultsToBeCreated.push({
        athleteId: lastAthlete.athleteId,
        scores: lastAthlete.scores,
        eventId,
        place: currentIndex + 1 - placeAdjustment,
        points: maxNumberOfAthletes - currentIndex + placeAdjustment,
      });
    }
    console.log("resultsToBeCreated", resultsToBeCreated);

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

    return NextResponse.json("Results created successfully", { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
