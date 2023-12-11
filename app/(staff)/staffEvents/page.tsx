import React from "react";
import Banner from "@/components/banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getHostId } from "@/lib/dbHelpers";
import { EventTableData } from "../../(hostAndStaff)/events/columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const getStaffEventsTableData = async (
  staffUserId: string,
): Promise<EventTableData[]> => {
  try {
    const hostId = await getHostId(staffUserId, "STAFF");

    if (!hostId) {
      return [];
    }

    const events = await prisma.event.findMany({
      where: {
        hostId,

        staffMember: {
          is: {
            userId: staffUserId,
          },
        },
      },
      select: {
        eventId: true,
        name: true,
        groupName: true,
        athletesBoyOrGirl: true,
        athletesCompeting: true,
        eventType: true,
        staffMember: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        recordHolderName: true,
        recordScore: true,
        yearRecordSet: true,
        maxNumberOfAthletesPerTeam: true,
        host: {
          select: {
            teams: true,
          },
        },
        locationName: true,
        date: true,
      },
    });

    return events.map(
      ({
        name,
        eventId,
        athletesBoyOrGirl,
        athletesCompeting,
        eventType,
        groupName,
        staffMember,
        maxNumberOfAthletesPerTeam,
        locationName,
        date,
        host,
        recordHolderName,
        recordScore,
        yearRecordSet,
      }) => ({
        eventId,
        eventFullName: `${groupName} ${
          athletesBoyOrGirl === "BOY" ? "Boy's" : "Girl's"
        } ${name}`,
        numberOfAthletes: athletesCompeting.length,
        staffName: staffMember?.user.name,
        maxNumberOfAthletes: host.teams.length * maxNumberOfAthletesPerTeam,
        locationName,
        date,
        recordString:
          !recordScore || !recordHolderName || !yearRecordSet
            ? "No record set"
            : `${
                recordScore + (eventType === "TRACK" ? "s" : "m")
              } - ${yearRecordSet} - ${recordHolderName}`,
        groupName,
        boyOrGirl: athletesBoyOrGirl,
      }),
    );
  } catch (e) {
    return [];
  }
};

const StaffEventsPage = async () => {
  const session = await getServerSession(authOptions);

  const StaffEventsTableData = await getStaffEventsTableData(
    session!.user.userId,
  );

  return (
    <div>
      <Banner text="My Events" />

      <div className="container mx-auto mt-2">
        <DataTable columns={columns} data={StaffEventsTableData} />
      </div>
    </div>
  );
};

export default StaffEventsPage;
