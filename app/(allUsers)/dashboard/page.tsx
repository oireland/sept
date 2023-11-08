import Link from "next/link";
import Banner from "../../../components/banner";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Scoreboard, ScoreboardData } from "./Scoreboard";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";

async function getScoreboardData(hostId: string) {
  try {
    const { teams } = await prisma.host.findUniqueOrThrow({
      where: {
        id: hostId,
      },
      select: {
        teams: true,
      },
    });
    // Get the points of every athlete with the right hostId
    const allAthletesPointsAndTeam = await prisma.athlete.findMany({
      where: {
        hostId,
      },
      select: {
        results: {
          select: {
            points: true,
          },
        },
        team: true,
      },
    });

    const teamsPointsArray = teams.map((team) => ({
      team,
      results: allAthletesPointsAndTeam
        .filter(
          (athlete) => athlete.results.length !== 0 && athlete.team === team
        )
        .map(({ results }) => results[0].points),
    }));

    const data: ScoreboardData = teamsPointsArray.map((team) => {
      let points = 0;
      team.results.forEach((value) => (points += value));
      return { team: team.team, points };
    });

    return data;
  } catch (e) {
    return [];
  }
}

const Dashboard = async () => {
  const session = await getServerSession(authOptions);

  const hostId = await getHostId(session!.user.id, session!.user.role);

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
        <div className="mx-auto h-[200px] w-4/5 max-w-[1000px] md:h-[300px] lg:h-[400px]">
          <Scoreboard data={scoreboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
