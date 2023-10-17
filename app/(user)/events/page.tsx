import React from "react";
import Banner from "../banner";

import events from "@/app/assets/images/events.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EventTableData } from "./columns";
import { prisma } from "@/lib/prisma";
import EventDataTable from "./EventDataTable";
import { UserRole } from "@prisma/client";
import { getHostId } from "@/lib/dbHelpers";

async function getEventData(userId: string, role: UserRole) {
  try {
    const hostId = await getHostId(userId, role);

    if (hostId === null) {
      return [];
    }

    const events = await prisma.event.findMany({
      where: {
        hostId,
      },
      select: {
        id: true,
        eventType: true,
        athletesBoyOrGirl: true,
        athletesCompeting: true,
        name: true,
        group: true,
      },
    });

    const data: EventTableData[] = events.map(
      ({
        name,
        id,
        athletesBoyOrGirl,
        athletesCompeting,
        eventType,
        group,
      }) => ({
        name,
        id,
        boyOrGirl: athletesBoyOrGirl,
        numberOfAthletes: athletesCompeting.length,
        eventType,
        group,
      })
    );

    return data;
  } catch (error) {
    return [];
  }
}

const Events = async () => {
  const session = await getServerSession(authOptions);

  const role = session!.user.role;

  const data: EventTableData[] = await getEventData(session!.user.id, role);

  return (
    <div>
      <Banner text="My Events" />

      <div className="container mx-auto mt-2">
        {role === "HOST" && (
          <Button variant="outline">
            <Link href={"/events/create"}>Create new events</Link>
          </Button>
        )}
        <EventDataTable data={data} />
      </div>
    </div>
  );
};

export default Events;
