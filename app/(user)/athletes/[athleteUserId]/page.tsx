import React from "react";
import Banner from "../../banner";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHostId } from "@/lib/dbHelpers";
import { BoyOrGirl } from "@prisma/client";
import { EventTableData } from "../../events/columns";
import RemoveEventsFromAthlete from "./RemoveEventsFromAthleteDataTable";
import AddEventsToAthleteDataTable from "./AddEventsToAthleteDataTable";

async function getEventsData(
  hostId: string,
  group: string,
  boyOrGirl: BoyOrGirl
) {
  try {
    const events = await prisma.event.findMany({
      where: {
        hostId,
        group,
        athletesBoyOrGirl: boyOrGirl,
      },
      select: {
        eventType: true,
        athletesCompeting: true,
        name: true,
        id: true,
      },
    });

    const eventsTableData: EventTableData[] = events.map(
      ({ name, athletesCompeting, eventType, id }) => ({
        name,
        numberOfAthletes: athletesCompeting.length,
        boyOrGirl,
        group,
        eventType,
        id,
      })
    );

    return eventsTableData;
  } catch (e) {
    return [];
  }
}

async function getAthleteData(athleteUserId: string) {
  try {
    console.log(athleteUserId);
    const athlete = await prisma.athlete.findUniqueOrThrow({
      where: {
        userId: athleteUserId,
      },
      select: {
        name: true,
        group: true,
        team: true,
        boyOrGirl: true,
        events: {
          select: {
            name: true,
            id: true,
            athletesBoyOrGirl: true,
            athletesCompeting: true,
            group: true,
            eventType: true,
          },
        },
        hostId: true,
      },
    });

    console.log(athlete);

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
  console.log(params);
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const hostId = await getHostId(userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const athlete = await getAthleteData(params.athleteUserId);

  if (athlete === null) {
    redirect(getURL("/athletes"));
  }

  const { name, team, boyOrGirl, events: athleteEvents, group } = athlete;

  const allEvents = await getEventsData(hostId, group, boyOrGirl);

  const competingEventsTableData: EventTableData[] = athleteEvents.map(
    ({ name, eventType, id, athletesBoyOrGirl, group, athletesCompeting }) => ({
      name,
      eventType,
      id,
      boyOrGirl: athletesBoyOrGirl,
      group,
      numberOfAthletes: athletesCompeting.length,
    })
  );

  const competingEventsIds = athleteEvents.map(({ id }) => id);

  const availableEventsTableData = allEvents.filter(
    ({ id }) => !competingEventsIds.includes(id)
  );

  const bannerText = `${name} - ${team} - ${group}`;

  return (
    <div>
      <Banner text={bannerText} />

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
          <Button variant="outline">
            <Link href={getURL("/athletes")}>Back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditAthlete;
