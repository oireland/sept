import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { EventTableDataSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  selectedRowData: yup.array().of(EventTableDataSchema).required(),
  athleteUserId: yup.string().required(),
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

    const { selectedRowData: events, athleteUserId } =
      await requestSchema.validate(await req.json());

    // get the group and gender of the athlete for filtering the events later
    const {
      group: athleteGroup,
      boyOrGirl: athleteBoyOrGirl,
      hostId: athleteHostId,
    } = await prisma.athlete.findUniqueOrThrow({
      where: {
        userId: athleteUserId,
      },
      select: {
        group: true,
        boyOrGirl: true,
        hostId: true,
      },
    });

    // to be used to check that athletes from the request belong to the host
    const hostId = await getHostId(session.user.id, session.user.role);

    if (hostId === null) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    // check that the athlete belongs to the host/ host of the staff member
    if (hostId !== athleteHostId) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    const eventsOfHost = await prisma.event.findMany({
      where: {
        hostId,
        group: athleteGroup,
        athletesBoyOrGirl: athleteBoyOrGirl,
      },
      select: {
        id: true,
      },
    });
    // filter the events from the request to only include those with a valid ID, group and boyOrGirl

    const validEventIds: string[] = eventsOfHost.map(({ id }) => id);

    const filteredEvents = events?.filter(
      ({ group, boyOrGirl, id }) =>
        group === athleteGroup &&
        boyOrGirl === athleteBoyOrGirl &&
        validEventIds.includes(id)
    );

    if (filteredEvents.length === 0) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    // update each event to have the athlete competing
    await Promise.all(
      filteredEvents?.map(
        async ({ id }) =>
          await prisma.event.update({
            where: {
              id,
            },
            data: {
              athletesCompeting: {
                connect: {
                  userId: athleteUserId,
                },
              },
            },
          })
      )
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
