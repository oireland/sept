import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import getURL from "@/lib/getURL";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Banner from "../../../../components/banner";
import { getEventData } from "@/lib/dbHelpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BackButton from "@/components/BackButton";
import { EventTableData } from "@/app/(hostAndStaff)/events/columns";
import dynamic from "next/dynamic";

// client components
const AddEventsToStaffDataTable = dynamic(
  () => import("./AddEventsToStaffDataTable")
);
const RemoveEventsFromStaffDataTable = dynamic(
  () => import("./RemoveEventsFromStaffDataTable")
);

const getStaffData = async (staffUserId: string, hostId: string) => {
  try {
    const staff = await prisma.staff.findUniqueOrThrow({
      where: {
        userId: staffUserId,
      },
      select: {
        staffId: true,
        hostId: true,
        events: {
          select: {
            name: true,
            athletesBoyOrGirl: true,
            athletesCompeting: true,
            eventType: true,
            group: {
              select: {
                groupName: true,
              },
            },
            eventId: true,
            maxNumberOfAthletes: true,
            date: true,
            location: {
              select: {
                locationName: true,
              },
            },
          },
        },
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (staff.hostId !== hostId) {
      return null;
    }
    return staff;
  } catch (e) {
    return null;
  }
};

const EditStaffPage = async ({
  params,
}: {
  params: { staffUserId: string };
}) => {
  const session = await getServerSession(authOptions);

  const staffUserId = params.staffUserId;

  const hostId = await getHostId(session!.user.userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const staffData = await getStaffData(staffUserId, hostId!);

  if (staffData === null) {
    redirect(getURL("/staff"));
  }

  const allEventsData = await getEventData(
    session!.user.userId,
    session!.user.role
  );

  console.log(staffData!.events);

  const staffsEventsTableData: EventTableData[] = staffData!.events.map(
    ({
      name,
      athletesBoyOrGirl,
      eventType,
      group,
      eventId,
      athletesCompeting,
      maxNumberOfAthletes,
      date,
      location,
    }) => ({
      eventId,
      boyOrGirl: athletesBoyOrGirl,
      eventType,
      groupName: group.groupName,
      name,
      numberOfAthletes: athletesCompeting.length,
      staffName: staffData!.user.name,
      maxNumberOfAthletes,
      date,
      locationName: location.locationName,
      staffUserId,
    })
  );

  const staffsEventsIds: string[] = staffData!.events.map(
    ({ eventId }) => eventId
  );

  const availableEventsTableData: EventTableData[] = allEventsData.filter(
    ({ eventId, staffName }) => !staffsEventsIds.includes(eventId) && !staffName
  );

  return (
    <div className="max-w-full overflow-x-hidden">
      <Banner text={staffData!.user.name} />

      <div className="container mx-auto mt-2 ">
        <h2 className="text-2xl font-semibold">Events Staffing</h2>
        <RemoveEventsFromStaffDataTable
          data={staffsEventsTableData}
          staffUserId={staffUserId}
        />

        <hr className="my-5" />

        <h2 className="text-2xl font-semibold">Available Events</h2>
        <AddEventsToStaffDataTable
          data={availableEventsTableData}
          staffUserId={staffUserId}
        />

        <hr className="my-5" />
        <div className="flex justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default EditStaffPage;
