import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import EnterResultsForm from "./EnterResultsForm";
import FloatingContainer from "@/components/FloatingContainer";
import InfoDialog from "./infoDialog";
import { Medal, Trophy } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BackButton from "@/components/BackButton";
import { Button } from "@/components/ui/button";
import axios from "axios";
import ClearResultsButton from "./ClearResultsButton";

async function getEventData(eventId: string, hostId: string) {
  try {
    const event = await prisma.event.findUniqueOrThrow({
      where: {
        id: eventId,
      },
      select: {
        hostId: true,
        eventType: true,
        athletesBoyOrGirl: true,
        athletesCompeting: {
          select: {
            name: true,
            boyOrGirl: true,
            group: true,
            userId: true,
            id: true,
            team: true,
            hostId: true,
            results: {
              where: {
                eventId,
              },
              select: {
                scores: true,
              },
            },
          },
        },
        name: true,
        group: true,
        numberOfAttempts: true,
        results: {
          select: {
            athleteId: true,
            place: true,
            points: true,
            scores: true,
          },
        },
      },
    });

    if (event.hostId !== hostId) {
      return null;
    }

    return event;
  } catch (e) {
    return null;
  }
}

const EnterEventResults = async ({
  params,
}: {
  params: { eventId: string };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const hostId = await getHostId(userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const eventData = await getEventData(params.eventId, hostId);

  if (eventData === null) {
    redirect(getURL("/events"));
  }

  const {
    name,
    group,
    athletesBoyOrGirl,
    athletesCompeting,
    eventType,
    numberOfAttempts,
    results: eventResults,
  } = eventData;

  const titleText = `${group} ${
    athletesBoyOrGirl === "BOY" ? "Boy's" : "Girl's"
  } ${name}`;

  // if there is no result on the event with the athlete's id, then results need to be entered.
  let haveAthletesCompeted = true;
  const eventResultAThleteIds = eventResults.map(({ athleteId }) => athleteId);
  athletesCompeting.forEach(({ id }) => {
    if (!eventResultAThleteIds.includes(id)) {
      // no result for this athlete for this event
      haveAthletesCompeted = false;
    }
  });

  if (haveAthletesCompeted) {
    return (
      <FloatingContainer>
        <h2 className="text-center text-xl font-semibold">Results</h2>

        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Place</TableHead>
                <TableHead>Athlete</TableHead>
                <TableHead>Points</TableHead>
                <TableHead>Score(s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventResults.map(({ place, points, scores, athleteId }) => {
                let athleteName = athletesCompeting.filter(
                  ({ id }) => id === athleteId
                )[0].name;
                return (
                  <TableRow key={athleteId}>
                    <TableCell className="font-medium">
                      {place === 1 ? (
                        <Medal className="text-[#FFD700]" />
                      ) : place === 2 ? (
                        <Medal className="text-[#C0C0C0]" />
                      ) : place === 3 ? (
                        <Medal className="text-[#CD7F32]" />
                      ) : (
                        place
                      )}
                    </TableCell>
                    <TableCell>{athleteName}</TableCell>
                    <TableCell>{points}</TableCell>
                    <TableCell>{scores.toString()}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <hr className="my-2" />
        <div className="flex items-center justify-between">
          <BackButton />
          <ClearResultsButton eventId={params.eventId} />
        </div>
      </FloatingContainer>
    );
  }

  return (
    <div>
      <FloatingContainer>
        <h2 className="text-center text-xl font-semibold text-brg">
          {titleText}
        </h2>

        <EnterResultsForm
          athletes={athletesCompeting.map(({ results, id, name }) => ({
            id,
            name,
            scores:
              results[0]?.scores ||
              Array.from(Array(numberOfAttempts), () => 0),
          }))}
          eventId={params.eventId}
          eventType={eventType}
          numberOfAttempts={numberOfAttempts}
        />
      </FloatingContainer>
    </div>
  );
};

export default EnterEventResults;
