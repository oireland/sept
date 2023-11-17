import Banner from "../../../components/banner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Scoreboard, ScoreboardData } from "./Scoreboard";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";

async function getScoreboardData(hostId: string) {
  try {
    const { teams, athletes } = await prisma.host.findUniqueOrThrow({
      where: {
        hostId,
      },
      select: {
        teams: {
          select: { teamName: true },
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

    const data: ScoreboardData = teams.map(({ teamName }) => {
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
        points: teamPoints,
      };
    });

    return data;
  } catch (e) {
    return [];
  }
}

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  const hostId = await getHostId(session!.user.userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const scoreboardData = await getScoreboardData(hostId);

  return (
    <div>
      <Banner text="Dashboard" />

      <div className="container mt-2 space-y-2">
        <h2 className="text-xl font-semibold md:text-2xl lg:text-3xl">
          Live Scoreboard
        </h2>
        <div className="mx-auto h-[200px] max-w-[1000px] md:h-[300px] lg:h-[400px]">
          <Scoreboard data={scoreboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
