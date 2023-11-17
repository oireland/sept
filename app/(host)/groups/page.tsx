import Banner from "@/components/banner";
import React from "react";
import GroupForm from "./GroupForm";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { redirect } from "next/navigation";
import { GroupDataTable } from "./GroupDataTable";

export const getGroups = async (hostId: string) => {
  try {
    const { groups } = await prisma.host.findUniqueOrThrow({
      where: {
        hostId,
      },
      select: {
        groups: {
          select: {
            athletes: true,
            groupName: true,
          },
        },
      },
    });

    return groups;
  } catch (e) {
    return [];
  }
};

const Groups = async () => {
  const session = await getServerSession(authOptions);
  const hostId = await getHostId(session!.user.userId, "HOST");
  if (!hostId) {
    redirect("/");
  }
  const groups = await getGroups(hostId);
  return (
    <div>
      <Banner text="Groups" />

      <div className="container px-10 py-4">
        <h2 className="mb-2 text-xl font-semibold">Add a new Group</h2>
        <GroupForm />

        <hr className="my-2" />
        <h2 className="mb-2 text-xl font-semibold">Your Groups</h2>

        <GroupDataTable
          data={groups.map(({ athletes, groupName }) => ({
            groupName,
            numberOfAthletes: athletes.length,
          }))}
        />
      </div>
    </div>
  );
};

export default Groups;
