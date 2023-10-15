import React from "react";
import Banner from "../../banner";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import AddAthletesToEventDataTable from "./AddAthletesToEventDataTable";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BoyOrGirl, UserRole } from "@prisma/client";
import { AthleteTableData } from "../../athletes/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import RemoveAthletesFromEventDataTable from "./RemoveAthletesFromEventDataTable";
import { getHostId } from "@/lib/dbHelpers";

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
            events: true,
            group: true,
            userId: true,
            id: true,
            team: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
        name: true,
        group: true,
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

async function getAthleteData(
  hostId: string,
  group: string,
  boyOrGirl: BoyOrGirl
) {
  try {
    const data = await prisma.athlete.findMany({
      where: {
        hostId,
        group,
        boyOrGirl,
      },
      select: {
        name: true,
        group: true,
        team: true,
        boyOrGirl: true,
        userId: true,
        events: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    const athletes: AthleteTableData[] = data.map(
      ({ name, group, team, boyOrGirl, userId, user, events }) => ({
        name,
        group,
        team,
        boyOrGirl,
        userId,
        email: user.email,
        numberOfEvents: events.length,
      })
    );

    return athletes;
  } catch (error) {
    return [];
  }
}

const EditEvent = async ({ params }: { params: { eventId: string } }) => {
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

  const { name, group, athletesBoyOrGirl, athletesCompeting } = eventData;

  const competingAthletesTableData: AthleteTableData[] = athletesCompeting.map(
    ({ userId, name, boyOrGirl, group, team, user, events }) => ({
      userId,
      name,
      numberOfEvents: events.length,
      boyOrGirl,
      email: user.email,
      group,
      team,
    })
  );

  const competingAthletesIds = competingAthletesTableData.map(
    ({ userId }) => userId
  );

  const allAthletesData: AthleteTableData[] = await getAthleteData(
    hostId,
    group,
    athletesBoyOrGirl
  );

  const availableAthletesData = allAthletesData.filter(
    ({ userId }) => !competingAthletesIds.includes(userId)
  );

  const bannerText = `${group} ${
    athletesBoyOrGirl === "BOY" ? "Boy's" : "Girl's"
  } ${name}`;

  return (
    <div>
      <Banner text={bannerText} />

      <div className="container mx-auto mt-2">
        <h2 className="text-2xl font-semibold">Competing Athletes</h2>
        <RemoveAthletesFromEventDataTable
          eventId={params.eventId}
          data={competingAthletesTableData}
        />

        <hr className="my-5" />

        <h2 className="text-2xl font-semibold">Available Athletes</h2>

        <AddAthletesToEventDataTable
          data={availableAthletesData}
          eventId={params.eventId}
        />
        <hr className="my-5" />
        <div className="flex justify-end">
          <Button variant="outline">
            <Link href={getURL("/events")}>Back</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
