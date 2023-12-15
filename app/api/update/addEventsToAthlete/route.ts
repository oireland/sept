import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  eventIds: yup.array().of(yup.string()).required(),
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
      host: athleteHost,
    } = await prisma.athlete.findUniqueOrThrow({
      where: {
        userId: athleteUserId,
      },
      select: {
        groupName: true,
        boyOrGirl: true,
        hostId: true,
        host: {
          select: {
            allowAthleteEventSignUp: true,
          },
        },
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

    if (!athleteHost.allowAthleteEventSignUp) {
      return NextResponse.json(
        "Host isn't letting athletes sign themselves up currently",
        { status: 400 },
      );
    }

    // update each event to have the athlete competing but only if the max number of athletes will not be exceeded
    await Promise.all(
      eventIds.map(
        async (eventId) =>
          await prisma.event.update({
            where: {
              eventId,
              hostId,
              groupName: athleteGroupName,
              athletesBoyOrGirl: athleteBoyOrGirl,
            },
            data: {
              athletesCompeting: {
                connect: {
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
    if (e instanceof Error) {
      return NextResponse.json(e.message, { status: 400 });
    } else {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
}
