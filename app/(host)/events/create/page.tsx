import FloatingContainer from "@/components/FloatingContainer";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";
import EventForm from "./EventForm";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getGroupsAndLocations(userId: string) {
  try {
    const data = await prisma.host.findUniqueOrThrow({
      where: {
        userId,
      },
      select: {
        groups: {
          select: {
            groupName: true,
          },
        },
        locations: {
          select: {
            locationName: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    return { groups: [], locations: [] };
  }
}

const CreateEvent = async () => {
  const session = await getServerSession(authOptions);

  const { groups, locations } = await getGroupsAndLocations(
    session!.user.userId
  );

  if (groups.length === 0) {
    return (
      <FloatingContainer className="space-y-3 p-4">
        <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
          You have no groups!
        </h2>
        <p className="text-center">
          Please make sure you have added your groups. We need to know what
          groups to create the events for.
        </p>
        <div className="flex justify-center">
          <Button variant={"outline"}>
            <Link href={getURL("/groups")}>Add Groups</Link>
          </Button>
        </div>
      </FloatingContainer>
    );
  }

  if (locations.length === 0) {
    return (
      <FloatingContainer className="space-y-3">
        <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
          You have no locations!
        </h2>
        <p className="text-center">
          Please make sure you have added your locations. We need to know what
          locations your events will be in before we you can create events.
        </p>
        <div className="flex justify-center">
          <Button variant={"outline"}>
            <Link href={getURL("/locations")}>Add Locations</Link>
          </Button>
        </div>
      </FloatingContainer>
    );
  }

  return (
    <FloatingContainer>
      <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
        Create an Event
      </h2>
      <EventForm
        groups={groups.map(({ groupName }) => groupName)}
        locations={locations.map(({ locationName }) => locationName)}
      />
    </FloatingContainer>
  );
};

export default CreateEvent;
