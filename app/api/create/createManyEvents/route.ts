import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { EventValidationSchema } from "@/lib/yupSchemas";
import { BoyOrGirl, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SingleEvent = {
  name: string;
  eventType: EventType;
  boyOrGirl: BoyOrGirl;
  group: string;
  maxNumberOfAthletes: number;
  numberOfAttempts: number;
  locationId: string;
  date: Date;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const request = await req.json();
    const eventsData = await EventValidationSchema.validate(request);

    console.log("eventsdata", eventsData);

    if (session?.user.role !== "HOST") {
      throw new Error("Unauthorised User");
    }

    const host = await prisma.host.findUniqueOrThrow({
      where: {
        userId: session.user.id,
      },
      select: {
        groups: true,
        id: true,
        locations: {
          select: {
            locationId: true,
          },
        },
      },
    });

    const { groups, id: hostId, locations: locationsObjects } = host;
    const locations = locationsObjects.map(({ locationId }) => locationId);

    if (!locations.includes(eventsData.locationId)) {
      return NextResponse.json("Invalid Location", { status: 400 });
    }

    const eventsToBeCreated: SingleEvent[] = [];

    eventsData.boyOrGirl.forEach((boyOrGirl) => {
      if (!boyOrGirl) return;
      eventsData.groups.forEach((group) => {
        if (!group) {
          return;
        }
        // if the group isn't one of the host's groups
        if (!groups.includes(group)) {
          return;
        }

        const event: SingleEvent = {
          name: eventsData.eventName,
          boyOrGirl,
          group,
          eventType: eventsData.trackOrField,
          maxNumberOfAthletes: eventsData.maxNumberOfAthletes,
          numberOfAttempts: eventsData.numberOfAttempts,
          date: eventsData.date,
          locationId: eventsData.locationId,
        };

        eventsToBeCreated.push(event);
      });
    });

    await prisma.event.createMany({
      data: eventsToBeCreated.map(
        ({
          boyOrGirl,
          eventType,
          group,
          maxNumberOfAthletes,
          name,
          numberOfAttempts,
          date,
          locationId,
        }) => ({
          athletesBoyOrGirl: boyOrGirl,
          eventType,
          group,
          hostId,
          maxNumberOfAthletes,
          name,
          numberOfAttempts,
          date,
          locationId,
        })
      ),
    });

    return NextResponse.json(
      { message: "Athletes successfully created" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(e, { status: 500 });
  }
}
