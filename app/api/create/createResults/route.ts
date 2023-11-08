import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { ResultSchema } from "@/lib/yupSchemas";
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
    if (!session || session.user.role !== "STAFF") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    let { results, eventId } = await requestSchema.validate(await req.json());

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
      numberOfAttempts,
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
        numberOfAttempts: true,
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

    console.log("athletes with all zero", athletesWithAllZero);

    // remove results with wrong numberOfAttempts, or all attempts are 0.
    results = results.filter(
      ({ scores }) =>
        scores.length === numberOfAttempts &&
        scores[eventType === "TRACK" ? numberOfAttempts - 1 : 0] !== 0
    );

    // sort athletes best to worst based on their best attempt
    if (eventType === "TRACK") {
      results = results.sort((a, b) => a.scores[0] - b.scores[0]); // low-high
    } else {
      results = results.sort((a, b) => b.scores[0] - a.scores[0]); // high-low
    }

    const resultsToBeCreated: {
      athleteId: string;
      eventId: string;
      place: number;
      points: number;
      scores: number[];
    }[] = [];

    let currentIndex = 0;
    let placeAdjustment = 0; // used to give same place and points in the case of a draw

    console.log("results before while", results);

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
        placeAdjustment > 0 && placeAdjustment--; // decrement unless it would make it negative

        continue;
      }
      // draw if only 1 attempt or second attempt the same
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

      if (current.scores[1] < next.scores[1]) {
        if (eventType === "TRACK") {
          // current is the better score
          resultsToBeCreated.push({
            athleteId: current.athleteId,
            eventId,
            place: currentIndex + 1 - placeAdjustment,
            points: maxNumberOfAthletes - currentIndex + placeAdjustment,
            scores: current.scores,
          });
          currentIndex++;
          placeAdjustment > 0 && placeAdjustment--;
          continue;
        } else {
          // current is the worse score, so swap and then add next to the array
          results[currentIndex] = next;
          results[currentIndex + 1] = current;
          resultsToBeCreated.push({
            athleteId: next.athleteId,
            eventId,
            place: currentIndex + 1 - placeAdjustment,
            points: maxNumberOfAthletes - currentIndex + placeAdjustment,
            scores: next.scores,
          });
          currentIndex++;
          placeAdjustment > 0 && placeAdjustment--;
          continue;
        }
      } else {
        if (eventType === "FIELD") {
          // current is better score
          resultsToBeCreated.push({
            athleteId: current.athleteId,
            eventId,
            place: currentIndex + 1 - placeAdjustment,
            points: maxNumberOfAthletes - currentIndex + placeAdjustment,
            scores: current.scores,
          });
          currentIndex++;
          placeAdjustment > 0 && placeAdjustment--;
          continue;
        } else {
          // current is the worse score
          results[currentIndex] = next;
          results[currentIndex + 1] = current;
          resultsToBeCreated.push({
            athleteId: next.athleteId,
            eventId,
            place: currentIndex + 1 - placeAdjustment,
            points: maxNumberOfAthletes - currentIndex + placeAdjustment,
            scores: next.scores,
          });
          currentIndex++;
          placeAdjustment > 0 && placeAdjustment--;
          continue;
        }
      }
    }

    // if there is still an athlete to make results for
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

    // create results for athletes who competed
    await prisma.result.createMany({
      data: resultsToBeCreated,
    });

    // remove the event from athletes who didn't compete (all 0s)
    await Promise.all(
      athletesWithAllZero.map((id) =>
        prisma.athlete.update({
          where: { id },
          data: {
            events: {
              disconnect: {
                id: eventId,
              },
            },
          },
        })
      )
    );

    return NextResponse.json(resultsToBeCreated, { status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
