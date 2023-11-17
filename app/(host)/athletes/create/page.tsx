import FloatingContainer from "@/components/FloatingContainer";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import getURL from "@/lib/getURL";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreateAthletesForm from "./CreateAthletesForm";

async function getGroupsAndTeams(userId: string) {
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
        teams: {
          select: {
            teamName: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    return { groups: [], teams: [] };
  }
}

const CreateAthletesPage = async () => {
  const session = await getServerSession(authOptions);

  const { groups, teams } = await getGroupsAndTeams(session!.user.userId);

  if (groups.length === 0) {
    return (
      <FloatingContainer className="space-y-3 p-4">
        <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
          You have no groups!
        </h2>
        <p className="text-center">
          Please make sure you have added your groups. We need to make sure the
          athletes you sign up the belong to one of your groups.
        </p>
        <div className="flex justify-center">
          <Button variant={"outline"}>
            <Link href={getURL("/groups")}>Add Groups</Link>
          </Button>
        </div>
      </FloatingContainer>
    );
  }

  if (teams.length === 0) {
    return (
      <FloatingContainer className="space-y-3">
        <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
          You have no teams!
        </h2>
        <p className="text-center">
          Please make sure you have added your teams. We need to make sure the
          athletes you sign up belong to one of your teams.
        </p>
        <div className="flex justify-center">
          <Button variant={"outline"}>
            <Link href={getURL("/teams")}>Add Teams</Link>
          </Button>
        </div>
      </FloatingContainer>
    );
  }

  return (
    <CreateAthletesForm
      allowedGroups={groups.map(({ groupName }) => groupName)}
      allowedTeams={teams.map(({ teamName }) => teamName)}
    />
  );
};

export default CreateAthletesPage;
