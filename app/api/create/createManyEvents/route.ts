import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { EventValidationSchema } from "@/lib/yupSchemas";
import { BoyOrGirl, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type SingleEvent = {
  name: string;
  eventType: EventType;
  athletesBoyOrGirl: BoyOrGirl;
  groupName: string;
  maxNumberOfAthletes: number;
  numberOfAttempts: number;
  locationName: string;
  date: Date;
  hostId: string;
};

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const request = await req.json();
    const eventsData = await EventValidationSchema.validate(request);

    if (session?.user.role !== "HOST") {
      throw new Error("Unauthorised User");
    }

    const host = await prisma.host.findUniqueOrThrow({
      where: {
        userId: session.user.userId,
      },
      select: {
        groups: {
          select: {
            groupName: true,
          },
        },
        hostId: true,
        locations: {
          select: {
            locationName: true,
          },
        },
      },
    });

    const { groups: groupsObjects, hostId, locations: locationsObjects } = host;
    const locations = locationsObjects.map(({ locationName }) => locationName);
    const groups = groupsObjects.map(({ groupName }) => groupName);

    if (!locations.includes(eventsData.locationName)) {
      return NextResponse.json("Invalid Location", { status: 400 });
    }

    eventsData.groupNames.forEach((groupName) => {
      if (!groups.includes(groupName)) {
        return NextResponse.json("Invalid Groups", { status: 400 });
      }
    });

    const eventsToBeCreated: SingleEvent[] = [];

    eventsData.boyOrGirl.forEach((boyOrGirl) => {
      eventsData.groupNames.forEach((groupName) => {
        const event: SingleEvent = {
          name: eventsData.eventName,
          athletesBoyOrGirl: boyOrGirl,
          groupName,
          eventType: eventsData.trackOrField,
          maxNumberOfAthletes: eventsData.maxNumberOfAthletes,
          numberOfAttempts: eventsData.numberOfAttempts,
          date: eventsData.date,
          locationName: eventsData.locationName,
          hostId,
        };

        eventsToBeCreated.push(event);
      });
    }); 

    await prisma.event.createMany({
      data: eventsToBeCreated,
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
