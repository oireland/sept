import React from "react";
import Banner from "../../../../components/banner";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHostId } from "@/lib/dbHelpers";
import { BoyOrGirl } from "@prisma/client";
import { EventTableData } from "../../../(hostAndStaff)/events/columns";
import RemoveEventsFromAthlete from "./RemoveEventsFromAthleteDataTable";
import AddEventsToAthleteDataTable from "./AddEventsToAthleteDataTable";
import BackButton from "@/components/BackButton";
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

async function getEventsData(
  hostId: string,
  groupName: string,
  boyOrGirl: BoyOrGirl
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
        maxNumberOfAthletes: true,
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
        maxNumberOfAthletes,
        locationName,
        date,
      }) => ({
        name,
        numberOfAthletes: athletesCompeting.length,
        boyOrGirl,
        groupName,
        eventType,
        eventId,
        maxNumberOfAthletes,
        locationName,
        date,
      })
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
            maxNumberOfAthletes: true,
            locationName: true,
            date: true,
          },
        },
        hostId: true,
      },
    });

    return athlete;
  } catch (error) {
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

  const athlete = await getAthleteData(params.athleteUserId, hostId);

  if (athlete === null) {
    redirect(getURL("/athletes"));
  }

  const {
    user,
    teamName,
    boyOrGirl,
    events: athleteEvents,
    groupName,
  } = athlete;
  const name = user.name;

  const allEvents = await getEventsData(hostId, groupName, boyOrGirl);

  const competingEventsTableData: EventTableData[] = athleteEvents.map(
    ({
      name,
      eventType,
      eventId,
      athletesBoyOrGirl,
      groupName,
      athletesCompeting,
      maxNumberOfAthletes,
      date,
      locationName,
    }) => ({
      name,
      eventType,
      eventId,
      boyOrGirl: athletesBoyOrGirl,
      groupName,
      numberOfAthletes: athletesCompeting.length,
      maxNumberOfAthletes,
      locationName,
      date,
    })
  );

  const competingEventsIds = athleteEvents.map(({ eventId }) => eventId);

  const availableEventsTableData = allEvents.filter(
    ({ eventId }) => !competingEventsIds.includes(eventId)
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
        <AddEventsToAthleteDataTable
          data={availableEventsTableData}
          athleteUserId={params.athleteUserId}
        />

        <hr className="my-5" />
        <div className="flex justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default EditAthlete;
