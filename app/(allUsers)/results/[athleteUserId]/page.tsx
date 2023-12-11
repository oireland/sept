import BackButton from "@/components/BackButton";
import Banner from "@/components/banner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import getURL from "@/lib/getURL";
import { prisma } from "@/lib/prisma";
import { Medal } from "lucide-react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

async function getAthleteResults(athleteUserId: string, hostId: string) {
  try {
    const results = await prisma.result.findMany({
      where: {
        athlete: {
          is: {
            userId: athleteUserId,

            hostId,
          },
        },
      },
      select: {
        athlete: {
          select: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        event: {
          select: {
            name: true,
          },
        },
        place: true,
        points: true,
        scores: true,
      },
    });

    return results;
  } catch (e) {
    return [];
  }
}

const AthleteResultsPage = async ({
  params,
}: {
  params: { athleteUserId: string };
}) => {
  const session = await getServerSession(authOptions);

  if (
    session?.user.role === "ATHLETE" &&
    session.user.userId !== params.athleteUserId
  ) {
    // user is an athlete but this is not the page for viewing their results
    redirect(getURL("/dashboard"));
  }

  const hostId = await getHostId(session!.user.userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/dashboard"));
  }

  const results = await getAthleteResults(params.athleteUserId, hostId!);

  return (
    <div>
      <Banner text={`${results[0].athlete.user.name}'s Results`} />

      <div className="container">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Place</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>Score(s)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map(({ place, points, scores, event }, index) => {
              return (
                <TableRow key={index}>
                  <TableCell>{event.name}</TableCell>

                  <TableCell className="flex justify-start text-left font-medium">
                    {place === 1 ? (
                      <Medal className="h-6 w-6 text-[#FFD700]" />
                    ) : place === 2 ? (
                      <Medal className="h-6 w-6 text-[#C0C0C0]" />
                    ) : place === 3 ? (
                      <Medal className="h-6 w-6 text-[#CD7F32]" />
                    ) : (
                      <span className="ml-1">{place}</span>
                    )}
                  </TableCell>
                  <TableCell>{points}</TableCell>
                  <TableCell>{scores.toString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <hr className="my-2 p-0" />
        <div className="flex justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default AthleteResultsPage;
