import React from "react";
import Banner from "../../../../components/banner";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import { getHostId } from "@/lib/dbHelpers";
import { BoyOrGirl } from "@prisma/client";
import { EventTableData } from "../../../(hostAndStaff)/events/columns";

import BackButton from "@/components/BackButton";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// client components
const RemoveEventsFromAthlete = dynamic(
  () => import("./RemoveEventsFromAthleteDataTable"),
);
const AddEventsToAthleteDataTable = dynamic(
  () => import("./AddEventsToAthleteDataTable"),
);

async function getEventsData(
  hostId: string,
  groupName: string,
  boyOrGirl: BoyOrGirl,
  numberOfTeams: number,
) {
  try {
    const events = await prisma.event.findMany({
      where: {
        hostId,
        groupName,
        athletesBoyOrGirl: boyOrGirl,
      },
      select: {
        eventType: true,
        athletesCompeting: true,
        name: true,
        eventId: true,
        maxNumberOfAthletesPerTeam: true,
        locationName: true,
        date: true,
      },
    });

    const eventsTableData: EventTableData[] = events.map(
      ({
        name,
        athletesCompeting,
        eventType,
        eventId,
        maxNumberOfAthletesPerTeam,
        locationName,
        date,
      }) => ({
        name,
        numberOfAthletes: athletesCompeting.length,
        boyOrGirl,
        groupName,
        eventType,
        eventId,
        maxNumberOfAthletes: maxNumberOfAthletesPerTeam * numberOfTeams,
        locationName,
        date,
      }),
    );

    return eventsTableData;
  } catch (e) {
    return [];
  }
}

async function getAthleteData(athleteUserId: string, hostId: string) {
  try {
    const athlete = await prisma.athlete.findUniqueOrThrow({
      where: {
        userId: athleteUserId,
        AND: {
          hostId,
        },
      },
      select: {
        user: {
          select: {
            name: true,
          },
        },
        groupName: true,
        teamName: true,

        boyOrGirl: true,
        events: {
          select: {
            name: true,
            eventId: true,
            athletesBoyOrGirl: true,
            athletesCompeting: true,
            groupName: true,
            eventType: true,
            maxNumberOfAthletesPerTeam: true,
            locationName: true,
            date: true,
          },
        },
        hostId: true,
        host: {
          select: {
            teams: true,
            allowAthleteEventSignUp: true,
          },
        },
      },
    });

    return athlete;
  } catch (error) {
    console.log(error);
    return null;
  }
}

const EditAthlete = async ({
  params,
}: {
  params: { athleteUserId: string };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session!.user.userId;

  if (
    session?.user.role === "ATHLETE" &&
    session.user.userId !== params.athleteUserId
  ) {
    // user is an athlete but this is not the page for editing their events.
    redirect(getURL("/dashboard"));
  }

  const hostId = await getHostId(userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }
  const athlete = await getAthleteData(params.athleteUserId, hostId!);

  if (athlete === null) {
    redirect(getURL("/athletes"));
  }

  const {
    user,
    teamName,
    boyOrGirl,
    events: athleteEvents,
    groupName,
    host,
  } = athlete!;
  const name = user.name;
  const numberOfTeams = host.teams.length;

  const allEvents = await getEventsData(
    hostId!,
    groupName,
    boyOrGirl,
    numberOfTeams,
  );

  const competingEventsTableData: EventTableData[] = athleteEvents.map(
    ({
      name,
      eventType,
      eventId,
      athletesBoyOrGirl,
      groupName,
      athletesCompeting,
      maxNumberOfAthletesPerTeam,

      date,
      locationName,
    }) => ({
      name,
      eventType,
      eventId,
      boyOrGirl: athletesBoyOrGirl,
      groupName,
      numberOfAthletes: athletesCompeting.length,
      maxNumberOfAthletes: maxNumberOfAthletesPerTeam * numberOfTeams,
      locationName,
      date,
    }),
  );

  const competingEventsIds = athleteEvents.map(({ eventId }) => eventId);

  const availableEventsTableData: EventTableData[] = allEvents.filter(
    ({ eventId }) => !competingEventsIds.includes(eventId),
  );

  return (
    <div>
      <Banner text={name} />

      <div className="container mx-auto mt-2">
        <h2 className="text-2xl font-semibold">Competing in</h2>
        <RemoveEventsFromAthlete
          data={competingEventsTableData}
          athleteUserId={params.athleteUserId}
        />
        <hr className="my-5" />

        <h2 className="text-2xl font-semibold">Available Events</h2>
        {session?.user.role === "ATHLETE" &&
        !athlete.host.allowAthleteEventSignUp ? (
          <Skeleton className="w-full  h-[100px] md:h-[200px] lg:h-[300px] xl:h-[400px] justify-center text-lg md:text-xl lg:text-2xl font-semibold align-middle flex items-center">
            <div className="text-center">
              <p>
                Your host isn't letting athletes sign themselves up at the
                moment.
              </p>
              <p className="text-base md:text-lg lg:text-xl">
                Ask a member of staff if you want to sign up
              </p>
            </div>
          </Skeleton>
        ) : (
          <AddEventsToAthleteDataTable
            data={availableEventsTableData}
            athleteUserId={params.athleteUserId}
          />
        )}

        <hr className="my-5" />
        <div className="flex justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default EditAthlete;
