import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { AthleteTableDataSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  eventId: yup.string().required(),
  selectedRowData: yup.array().of(AthleteTableDataSchema).required(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      !(session.user.role === "HOST" || session.user.role === "STAFF")
    ) {
      return NextResponse.json("Unauthorised request", { status: 401 });
    }

    const body = await req.json();

    const { eventId, selectedRowData: athletes } =
      await requestSchema.validate(body);

    // get the group and gender of the event for filtering the athletes later
    const {
      groupName: eventGroupName,
      athletesBoyOrGirl,
      hostId: eventHostId,
      maxNumberOfAthletesPerTeam,
      athletesCompeting,
      host: eventHost,
    } = await prisma.event.findUniqueOrThrow({
      where: {
        eventId,
      },
      select: {
        groupName: true,
        athletesBoyOrGirl: true,
        hostId: true,
        maxNumberOfAthletesPerTeam: true,
        athletesCompeting: {
          select: {
            teamName: true,
          },
        },
        host: {
          select: {
            teams: true,
          },
        },
      },
    });

    // to be used to check that athletes from the request belong to the host
    const hostId = await getHostId(session.user.userId, session.user.role);

    // check that the event belongs to the host/ host of the staff member
    if (hostId !== eventHostId) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    const athletesOfHost = await prisma.athlete.findMany({
      where: {
        hostId,
        groupName: eventGroupName,
        boyOrGirl: athletesBoyOrGirl,
      },
      select: {
        userId: true,
        teamName: true,
      },
    });
    // filter the athletes from the request to only include those with a valid ID, group and boyOrGirl

    const validAthleteIds: string[] = athletesOfHost.map(
      (athlete) => athlete.userId,
    );

    const filteredAthletes = athletes?.filter(
      ({ groupName, boyOrGirl, userId }) =>
        groupName === eventGroupName &&
        boyOrGirl === athletesBoyOrGirl &&
        validAthleteIds.includes(userId),
    );

    if (filteredAthletes.length === 0) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    const numberOfAthletesInTeamsMap = new Map(); // [teamName: numberOfAthletesInTheTeamCompeting]

    eventHost.teams.forEach(({ teamName }) => {
      numberOfAthletesInTeamsMap.set(teamName, 0);
    });

    athletesCompeting.forEach(({ teamName }) => {
      let current = numberOfAthletesInTeamsMap.get(teamName);
      numberOfAthletesInTeamsMap.set(teamName, current + 1);
    });

    let teamsBeingExceeded = new Set<string>();

    athletes.forEach(({ teamName }) => {
      let current = numberOfAthletesInTeamsMap.get(teamName);
      numberOfAthletesInTeamsMap.set(teamName, current + 1);
      if (current + 1 > maxNumberOfAthletesPerTeam) {
        // adding this athlete would exceed the max number of athletes per team
        teamsBeingExceeded.add(teamName);
      }
    });

    const teamsBeingExceededArray = Array.from(teamsBeingExceeded);
    if (teamsBeingExceededArray.length > 0) {
      let teamsString = "";
      teamsBeingExceededArray.forEach((team) => (teamsString += team + ", "));
      teamsString = teamsString.slice(0, -2);
      return NextResponse.json(
        `The max number of athletes in: ${teamsString} will be exceeded.`,
        { status: 400 },
      );
    }

    // update each athlete to be competing in the event
    filteredAthletes?.forEach(
      async ({ userId }) =>
        await prisma.athlete.update({
          where: {
            userId,
          },
          data: {
            events: {
              connect: {
                eventId,
              },
            },
          },
        }),
    );

    return NextResponse.json("Successfully added athletes to event", {
      status: 200,
    });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(e.message, { status: 400 });
    } else {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
}
