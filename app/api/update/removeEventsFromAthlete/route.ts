import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { EventTableDataSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  eventIds: yup.array().of(yup.string().required()).required(),
  athleteUserId: yup.string().required(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const { eventIds, athleteUserId } = await requestSchema.validate(
      await req.json(),
    );

    if (
      !session ||
      !(
        session.user.role === "HOST" ||
        session.user.role === "STAFF" ||
        session.user.userId === athleteUserId
      )
    ) {
      return NextResponse.json("Unauthorised request", { status: 401 });
    }
    // get the group and gender of the athlete for filtering the events later
    const {
      groupName: athleteGroupName,
      boyOrGirl: athleteBoyOrGirl,
      hostId: athleteHostId,
    } = await prisma.athlete.findUniqueOrThrow({
      where: {
        userId: athleteUserId,
      },
      select: {
        groupName: true,
        boyOrGirl: true,
        hostId: true,
      },
    });

    // to be used to check that athletes from the request belong to the host
    const hostId = await getHostId(session.user.userId, session.user.role);

    if (hostId === null) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    // check that the athlete belongs to the host/ host of the staff member
    if (hostId !== athleteHostId) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    // get ids of valid events of the host that were in the request
    const eventsOfHost = await prisma.event.findMany({
      where: {
        hostId,
        groupName: athleteGroupName,
        athletesBoyOrGirl: athleteBoyOrGirl,
        eventId: {
          in: eventIds,
        },
      },
      select: {
        eventId: true,
      },
    });

    // update each event to have the athlete competing
    await Promise.all(
      eventsOfHost?.map(
        async ({ eventId }) =>
          await prisma.event.update({
            where: {
              eventId,
            },
            data: {
              athletesCompeting: {
                disconnect: {
                  userId: athleteUserId,
                },
              },
            },
          }),
      ),
    );

    return NextResponse.json("Successfully added events to athlete", {
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
