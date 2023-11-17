import Banner from "@/components/banner";
import React from "react";
import TeamForm from "./TeamForm";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { redirect } from "next/navigation";
import { TeamDataTable } from "./TeamDataTable";

export const getTeams = async (hostId: string) => {
  try {
    const { teams } = await prisma.host.findUniqueOrThrow({
      where: {
        hostId,
      },
      select: {
        teams: {
          select: {
            athletes: true,
            teamName: true,
          },
        },
      },
    });

    return teams;
  } catch (e) {
    return [];
  }
};

const TeamsPage = async () => {
  const session = await getServerSession(authOptions);
  const hostId = await getHostId(session!.user.userId, "HOST");
  if (!hostId) {
    redirect("/");
  }
  const teams = await getTeams(hostId);
  return (
    <div>
      <Banner text="Teams" />

      <div className="container px-10 py-4">
        <h2 className="mb-2 text-xl font-semibold">Add a new Team</h2>
        <TeamForm />

        <hr className="my-2" />
        <h2 className="mb-2 text-xl font-semibold">Your Teams</h2>

        <TeamDataTable
          data={teams.map(({ athletes, teamName }) => ({
            teamName,
            numberOfAthletes: athletes.length,
          }))}
        />
      </div>
    </div>
  );
};

export default TeamsPage;
