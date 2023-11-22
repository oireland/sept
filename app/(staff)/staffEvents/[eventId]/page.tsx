import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import FloatingContainer from "@/components/FloatingContainer";
import { Medal } from "lucide-react";
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
import Link from "next/link";
import dynamic from "next/dynamic";

// client components
const ClearResultsButton = dynamic(() => import("./ClearResultsButton"));
const EnterResultsForm = dynamic(() => import("./EnterResultsForm"));

async function getEventData(eventId: string, hostId: string) {
  try {
    const event = await prisma.event.findUniqueOrThrow({
      where: {
        eventId,
      },
      select: {
        hostId: true,
        eventType: true,
        athletesBoyOrGirl: true,
        athletesCompeting: {
          select: {
            user: { select: { name: true } },
            boyOrGirl: true,
            groupName: true,
            userId: true,
            athleteId: true,
            teamName: true,
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
        groupName: true,
        numberOfAttempts: true,
        maxNumberOfAthletesPerTeam: true,
        host: {
          select: {
            teams: {
              select: {
                teamName: true,
              },
            },
          },
        },
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

export function getTeamsBeingExceeded(
  maxPerTeam: number,
  athletesTeams: { teamName: string }[],
  hostsTeams: { teamName: string }[],
) {
  const numberOfAthletesInTeamsMap = new Map(); // [teamName: numberOfAthletesInTheTeamCompeting]

  hostsTeams.forEach(({ teamName }) => {
    numberOfAthletesInTeamsMap.set(teamName, 0);
  });

  let teamsBeingExceeded = new Set<string>();

  athletesTeams.forEach(({ teamName }) => {
    let current = numberOfAthletesInTeamsMap.get(teamName);
    numberOfAthletesInTeamsMap.set(teamName, current + 1);
    if (current + 1 > maxPerTeam) {
      teamsBeingExceeded.add(teamName);
    }
  });

  return Array.from(teamsBeingExceeded);
}

const EnterEventResults = async ({
  params,
}: {
  params: { eventId: string };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session!.user.userId;

  const hostId = await getHostId(userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const eventData = await getEventData(params.eventId, hostId!);

  if (eventData === null) {
    redirect(getURL("/events"));
  }

  const {
    name,
    groupName,
    athletesBoyOrGirl,
    athletesCompeting,
    eventType,
    numberOfAttempts,
    results: eventResults,
    maxNumberOfAthletesPerTeam,
    host,
  } = eventData!;

  const titleText = `${groupName} ${
    athletesBoyOrGirl === "BOY" ? "Boy's" : "Girl's"
  } ${name}`;

  const teamsBeingExceeded = getTeamsBeingExceeded(
    maxNumberOfAthletesPerTeam,
    athletesCompeting.map(({ teamName }) => ({ teamName })),
    host.teams,
  );

  if (teamsBeingExceeded.length > 0) {
    // One or more teams have too many athletes competing
    return (
      <FloatingContainer className="space-y-3 p-4 text-center">
        <h2 className="mt-2  text-xl font-semibold text-brg sm:text-2xl">
          {teamsBeingExceeded.length} teams have too many athletes signed up for
          this event!
        </h2>
        <p>The following teams have too many athletes in this event:</p>
        {teamsBeingExceeded.map((teamName) => (
          <p className="p-1 rounded-sm bg-muted w-fit mx-auto" key={teamName}>
            {teamName}
          </p>
        ))}
        <p>
          The maximum number of athletes per team is{" "}
          <b>{maxNumberOfAthletesPerTeam}</b>
        </p>
        <div className="flex justify-center">
          <Button variant={"outline"}>
            <Link href={getURL(`/events/${params.eventId}`)}>
              Edit Athletes
            </Link>
          </Button>
        </div>
      </FloatingContainer>
    );
  }

  // if there is no result on the event with the athlete's id, then results need to be entered.
  let haveAthletesCompeted = true;
  const eventResultAThleteIds = eventResults.map(({ athleteId }) => athleteId);
  athletesCompeting.forEach(({ athleteId }) => {
    if (!eventResultAThleteIds.includes(athleteId)) {
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
                <TableHead className="px-1">Place</TableHead>
                <TableHead className="px-1">Athlete</TableHead>
                <TableHead className="px-1">Points</TableHead>
                <TableHead className="px-1">Score(s)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {eventResults.map(
                ({ place, points, scores, athleteId: eventAthleteId }) => {
                  let athleteName = athletesCompeting.filter(
                    ({ athleteId }) => athleteId === eventAthleteId,
                  )[0].user.name;
                  return (
                    <TableRow key={eventAthleteId}>
                      <TableCell className="flex justify-start text-left font-medium">
                        {place === 1 ? (
                          <Medal className="h-6 w-6 text-[#FFD700]" />
                        ) : place === 2 ? (
                          <Medal className="h-6 w-6 text-[#C0C0C0]" />
                        ) : place === 3 ? (
                          <Medal className="h-6 w-6 text-[#CD7F32]" />
                        ) : (
                          <span className="ml-1">{place}</span>
                        )}
                      </TableCell>
                      <TableCell className="px-1">{athleteName}</TableCell>
                      <TableCell className="px-1">{points}</TableCell>
                      <TableCell className="px-1">
                        {scores.toString()}
                      </TableCell>
                    </TableRow>
                  );
                },
              )}
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
      <FloatingContainer className="w-full py-2 px-1">
        <h2 className="text-center text-xl font-semibold text-brg">
          {titleText}
        </h2>

        <EnterResultsForm
          athletes={athletesCompeting.map(({ results, athleteId, user }) => ({
            athleteId,
            name: user.name,
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
