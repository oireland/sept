import React from "react";
import Banner from "../banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getHostId } from "@/lib/dbHelpers";
import { EventTableData } from "../events/columns";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";

const getStaffEventsTableData = async (
  staffUserId: string
): Promise<EventTableData[]> => {
  try {
    const hostId = await getHostId(staffUserId, "STAFF");

    if (!hostId) {
      return [];
    }

    const events = await prisma.event.findMany({
      where: {
        hostId,
        AND: {
          staffMember: {
            userId: staffUserId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        group: true,
        athletesBoyOrGirl: true,
        athletesCompeting: true,
        eventType: true,
        staffMember: {
          select: {
            name: true,
          },
        },
        maxNumberOfAthletes: true,
      },
    });

    return events.map(
      ({
        athletesBoyOrGirl,
        name,
        eventType,
        group,
        id,
        staffMember,
        athletesCompeting,
        maxNumberOfAthletes,
      }) => ({
        id,
        name,
        boyOrGirl: athletesBoyOrGirl,
        eventType,
        group,
        numberOfAthletes: athletesCompeting.length,
        staffName: staffMember?.name,
        maxNumberOfAthletes,
      })
    );
  } catch (e) {
    return [];
  }
};

const StaffEventsPage = async () => {
  const session = await getServerSession(authOptions);

  const StaffEventsTableData = await getStaffEventsTableData(session!.user.id);

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
