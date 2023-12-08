import Banner from "../../../components/banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ScoreboardData } from "./Scoreboard";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import AthleteSignupPermissionToggle from "./AthleteSignupPermissionToggle";

const Scoreboard = dynamic(() => import("./Scoreboard"));

async function getScoreboardData(hostId: string) {
  try {
    const { teams, athletes } = await prisma.host.findUniqueOrThrow({
      where: {
        hostId,
      },
      select: {
        teams: {
          select: { teamName: true, hexColour: true },
        },
        athletes: {
          select: {
            results: {
              select: {
                points: true,
              },
            },
            team: {
              select: {
                teamName: true,
              },
            },
          },
        },
      },
    });

    const data: ScoreboardData = teams.map(({ teamName, hexColour }) => {
      let teamPoints = 0;
      athletes.forEach(({ results, team }) => {
        if (team.teamName === teamName) {
          results.forEach(({ points }) => {
            teamPoints += points;
          });
        }
      });
      return {
        teamName,
        teamColour: hexColour,
        points: teamPoints,
      };
    });

    return data;
  } catch (e) {
    return [];
  }
}

async function getHostAthleteEventSignupPermission(hostId: string) {
  try {
    const { allowAthleteEventSignUp } = await prisma.host.findUniqueOrThrow({
      where: {
        hostId,
      },
      select: {
        allowAthleteEventSignUp: true,
      },
    });

    return allowAthleteEventSignUp;
  } catch (e) {
    throw e;
  }
}

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  const hostId = await getHostId(session!.user.userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const isAthleteEventSignupAllowed =
    await getHostAthleteEventSignupPermission(hostId);

  const scoreboardData = await getScoreboardData(hostId!);

  return (
    <div>
      <Banner text="Dashboard" showBackButton={false} />

      <div className="container mt-2 space-y-2">
        <h2 className="text-xl font-semibold md:text-2xl lg:text-3xl">
          Live Scoreboard
        </h2>
        <div className="mx-auto  h-[200px] md:h-[300px] lg:h-[400px] xl:h-[500px]">
          {scoreboardData.length === 0 ? (
            <Skeleton className="w-full h-full justify-center text-lg md:text-xl lg:text-2xl font-semibold align-middle flex items-center">
              No Teams...
            </Skeleton>
          ) : (
            <Scoreboard data={scoreboardData} />
          )}
        </div>

        {/* HOST ONLY - Toggle permission for athletes to sign up to events themselves */}
        {session!.user.role === "HOST" && (
          <div>
            <h2 className="text-xl font-semibold md:text-2xl lg:text-3xl">
              Athlete Permissions
            </h2>
            <AthleteSignupPermissionToggle
              isToggled={isAthleteEventSignupAllowed}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
