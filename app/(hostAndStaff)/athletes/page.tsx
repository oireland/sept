import dynamic from "next/dynamic";

import Banner from "../../../components/banner";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AthleteTableData } from "./columns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { redirect } from "next/navigation";

// client components
const AthleteDataTable = dynamic(() => import("./AthleteDataTable"));

async function getAthleteData(hostId: string) {
  try {
    const data = await prisma.athlete.findMany({
      where: {
        hostId,
      },
      select: {
        group: {
          select: {
            groupName: true,
          },
        },
        team: {
          select: {
            teamName: true,
          },
        },
        boyOrGirl: true,
        userId: true,
        events: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const athletes: AthleteTableData[] = data.map(
      ({ group, team, boyOrGirl, userId, user, events }) => ({
        name: user.name,
        groupName: group.groupName,
        teamName: team.teamName,
        boyOrGirl,
        userId,
        email: user.email!,
        numberOfEvents: events.length,
      })
    );

    return athletes;
  } catch (error) {
    return [];
  }
}

const Athletes = async () => {
  const session = await getServerSession(authOptions);

  const role = session!.user.role;

  const hostId = await getHostId(session!.user.userId, role);

  if (hostId === null) {
    redirect("/");
  }
  const athleteData = await getAthleteData(hostId!);

  return (
    <div>
      <Banner text="Athletes" />

      <div className="container mx-auto mt-2">
        {role === "HOST" && (
          <Button asChild variant="outline">
            <Link href={"/athletes/create"}>Sign up new Athletes</Link>
          </Button>
        )}
        <AthleteDataTable userRole={role} data={athleteData} />
      </div>
    </div>
  );
};

export default Athletes;
