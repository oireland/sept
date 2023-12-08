import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { EventValidationSchema } from "@/lib/yupSchemas";
import { BoyOrGirl, EventType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type SingleEvent = {
  name: string;
  eventType: EventType;
  athletesBoyOrGirl: BoyOrGirl;
  groupName: string;
  maxNumberOfAthletesPerTeam: number;
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
    const allowedLocations = locationsObjects.map(
      ({ locationName }) => locationName,
    );
    const allowedGroups = groupsObjects.map(({ groupName }) => groupName);

    if (!allowedLocations.includes(eventsData.locationName)) {
      return NextResponse.json("Invalid Location", { status: 400 });
    }

    eventsData.groupNames.forEach((groupName) => {
      if (!allowedGroups.includes(groupName)) {
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
          eventType: eventsData.eventType,
          maxNumberOfAthletesPerTeam: eventsData.maxNumberOfAthletesPerTeam,
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

    return NextResponse.json("Athletes successfully created", { status: 200 });
  } catch (e) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
