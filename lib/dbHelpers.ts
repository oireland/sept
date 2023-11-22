import { UserRole } from "@prisma/client";
import { prisma } from "./prisma";
import { EventTableData } from "@/app/(hostAndStaff)/events/columns";

export async function getHostId(userId: string, userRole: UserRole) {
  try {
    if (userRole === "HOST") {
      const { hostId } = await prisma.host.findUniqueOrThrow({
        where: {
          userId,
        },
        select: {
          hostId: true,
        },
      });
      return hostId;
    } else if (userRole === "STAFF") {
      const { hostId } = await prisma.staff.findUniqueOrThrow({
        where: {
          userId,
        },
        select: {
          hostId: true,
        },
      });
      return hostId;
    } else if (userRole === "ATHLETE") {
      const { hostId } = await prisma.athlete.findUniqueOrThrow({
        where: {
          userId,
        },
        select: {
          hostId: true,
        },
      });
      return hostId;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getLocations(hostId: string) {
  try {
    const { locations } = await prisma.host.findUniqueOrThrow({
      where: {
        hostId,
      },
      select: {
        locations: {
          select: {
            events: true,
            locationName: true,
          },
        },
      },
    });

    return locations;
  } catch (e) {
    return [];
  }
}

export async function getEventData(userId: string, role: UserRole) {
  try {
    const hostId = await getHostId(userId, role);

    if (hostId === null) {
      return [];
    }

    const events = await prisma.event.findMany({
      where: {
        hostId,
      },
      select: {
        eventId: true,
        eventType: true,
        athletesBoyOrGirl: true,
        athletesCompeting: true,
        name: true,
        group: true,
        staffMember: {
          select: {
            user: {
              select: {
                userId: true,
                name: true,
              },
            },
          },
        },
        maxNumberOfAthletesPerTeam: true,
        location: {
          select: {
            locationName: true,
          },
        },
        host: {
          select: {
            teams: true,
          },
        },
        date: true,
      },
    });

    const data: EventTableData[] = events.map(
      ({
        name,
        eventId,
        athletesBoyOrGirl,
        athletesCompeting,
        eventType,
        group,
        staffMember,
        maxNumberOfAthletesPerTeam,
        location,
        date,
        host,
      }) => ({
        name,
        eventId,
        boyOrGirl: athletesBoyOrGirl,
        numberOfAthletes: athletesCompeting.length,
        eventType,
        groupName: group.groupName,
        staffName: staffMember?.user.name,
        maxNumberOfAthletes: host.teams.length * maxNumberOfAthletesPerTeam,
        locationName: location.locationName,
        date,
      }),
    );

    return data;
  } catch (error) {
    return [];
  }
}
