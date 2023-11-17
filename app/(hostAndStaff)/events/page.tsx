import React from "react";
import Banner from "../../../components/banner";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EventTableData } from "./columns";
import { prisma } from "@/lib/prisma";
import EventDataTable from "./EventDataTable";
import { UserRole } from "@prisma/client";
import { getHostId } from "@/lib/dbHelpers";

export async function getEventData(userId: string, role: UserRole) {
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
        eventId: true,
        eventType: true,
        athletesBoyOrGirl: true,
        athletesCompeting: true,
        name: true,
        group: true,
        staffMember: {
          select: {
            user: {
              select: {
                userId: true,
                name: true,
              },
            },
          },
        },
        maxNumberOfAthletes: true,
        location: {
          select: {
            locationName: true,
          },
        },
        date: true,
      },
    });

    const data: EventTableData[] = events.map(
      ({
        name,
        eventId,
        athletesBoyOrGirl,
        athletesCompeting,
        eventType,
        group,
        staffMember,
        maxNumberOfAthletes,
        location,
        date,
      }) => ({
        name,
        eventId,
        boyOrGirl: athletesBoyOrGirl,
        numberOfAthletes: athletesCompeting.length,
        eventType,
        groupName: group.groupName,
        staffName: staffMember?.user.name,
        maxNumberOfAthletes,
        locationName: location.locationName,
        date,
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

  const data: EventTableData[] = await getEventData(session!.user.userId, role);

  console.log("event table data", data);

  return (
    <div>
      <Banner text="Events" />

      <div className="container mx-auto mt-2">
        {role === "HOST" && (
          <Button variant="outline">
            <Link href={"/events/create"}>Create new events</Link>
          </Button>
        )}
        <EventDataTable userRole={role} data={data} />
      </div>
    </div>
  );
};

export default Events;
