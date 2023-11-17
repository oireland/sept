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

    const { eventId, selectedRowData: athletes } = await requestSchema.validate(
      body
    );

    // get the group and gender of the event for filtering the athletes later
    const {
      groupName: eventGroupName,
      athletesBoyOrGirl,
      hostId: eventHostId,
      maxNumberOfAthletes,
      athletesCompeting,
    } = await prisma.event.findUniqueOrThrow({
      where: {
        eventId,
      },
      select: {
        groupName: true,
        athletesBoyOrGirl: true,
        hostId: true,
        maxNumberOfAthletes: true,
        athletesCompeting: true,
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
      },
    });
    // filter the athletes from the request to only include those with a valid ID, group and boyOrGirl

    const validAthleteIds: string[] = athletesOfHost.map(
      (athlete) => athlete.userId
    );

    const filteredAthletes = athletes?.filter(
      ({ groupName, boyOrGirl, userId }) =>
        groupName === eventGroupName &&
        boyOrGirl === athletesBoyOrGirl &&
        validAthleteIds.includes(userId)
    );

    if (filteredAthletes.length === 0) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    if (
      filteredAthletes.length + athletesCompeting.length >
      maxNumberOfAthletes
    ) {
      return NextResponse.json("Max number of athletes will be exceeded", {
        status: 400,
      });
    }

    // update each athlete to be competing in the event
    await Promise.all(
      filteredAthletes?.map(
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
          })
      )
    );

    return NextResponse.json("Successfully added athletes to event", {
      status: 200,
    });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json(e.message, { status: 400 });
    } else {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
}
