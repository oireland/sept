import Banner from "../banner";

import athlete from "@/app/assets/images/athlete.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AthleteTableData } from "./columns";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import AthleteDataTable from "./AthleteDataTable";
import { UserRole } from "@prisma/client";
import { getHostId } from "@/lib/dbHelpers";
import { redirect } from "next/navigation";

async function getAthleteData(hostId: string) {
  try {
    const data = await prisma.athlete.findMany({
      where: {
        hostId,
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

    if (!data) {
      throw new Error("No data");
    }

    const athletes: AthleteTableData[] = data.map(
      ({ name, group, team, boyOrGirl, userId, user, events }) => ({
        name,
        group,
        team,
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

  const hostId = await getHostId(session!.user.id, role);

  if (hostId === null) {
    redirect("/");
  }
  const athleteData = await getAthleteData(hostId);

  return (
    <div>
      <Banner text="Your Athletes" />

      <div className="container mx-auto mt-2">
        {role === "HOST" && (
          <Button asChild variant="outline">
            <Link href={"/athletes/create"}>Sign up new Athletes</Link>
          </Button>
        )}
        <AthleteDataTable data={athleteData} />
      </div>
    </div>
  );
};

export default Athletes;
