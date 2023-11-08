import React from "react";
import Banner from "../../../../components/banner";
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
import BackButton from "@/components/BackButton";
import { getLocations } from "@/app/(host)/locations/page";
import UpdateLocationForm from "./UpdateLocationForm";
import UpdateStaffForm from "./UpdateStaffForm";

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
        staffMember: {
          select: {
            name: true,
            id: true,
          },
        },
        name: true,
        group: true,
        maxNumberOfAthletes: true,
        location: {
          select: {
            locationId: true,
            locationName: true,
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

async function getStaffData(hostId: string) {
  try {
    const { staff } = await prisma.host.findUniqueOrThrow({
      where: {
        id: hostId,
      },
      select: {
        staff: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return staff;
  } catch (e) {
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

  const {
    name,
    group,
    athletesBoyOrGirl,
    athletesCompeting,
    maxNumberOfAthletes,
    location: currentLocation,
    staffMember: currentStaff,
  } = eventData;

  const allLocations = await getLocations(hostId);
  const allStaff = await getStaffData(hostId);

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

      <div className="container mx-auto mt-2 space-y-5">
        {session?.user.role === "HOST" && (
          <>
            <div>
              <h2 className="text-xl font-semibold">Location</h2>
              <UpdateLocationForm
                locations={allLocations}
                currentLocation={currentLocation}
                eventId={params.eventId}
              />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Staff</h2>
              <UpdateStaffForm
                staff={allStaff.map(({ id, name }) => ({
                  staffId: id,
                  staffName: name,
                }))}
                currentStaff={
                  currentStaff
                    ? { staffId: currentStaff.id, staffName: currentStaff.name }
                    : undefined
                }
                eventId={params.eventId}
              />
            </div>
          </>
        )}

        <div>
          <h2 className="text-xl font-semibold">
            Competing Athletes - Maximum {maxNumberOfAthletes}
          </h2>
          <RemoveAthletesFromEventDataTable
            eventId={params.eventId}
            data={competingAthletesTableData}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Available Athletes</h2>

          <AddAthletesToEventDataTable
            data={availableAthletesData}
            eventId={params.eventId}
          />
        </div>
        <div className="flex justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
