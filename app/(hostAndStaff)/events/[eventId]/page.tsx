import Banner from "../../../../components/banner";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BoyOrGirl } from "@prisma/client";
import { AthleteTableData } from "../../athletes/columns";
import { getHostId, getLocations } from "@/lib/dbHelpers";
import BackButton from "@/components/BackButton";
import UpdateEventDetailsForm from "./UpdateEventDetailsForm";
import dynamic from "next/dynamic";
import { AlertCircle } from "lucide-react";
import { getTeamsBeingExceeded } from "@/app/(staff)/staffEvents/[eventId]/page";

const AddAthletesToEventDataTable = dynamic(
  () => import("./AddAthletesToEventDataTable"),
);
const RemoveAthletesFromEventDataTable = dynamic(
  () => import("./RemoveAthletesFromEventDataTable"),
);

async function getEventData(eventId: string, hostId: string) {
  try {
    const event = await prisma.event.findUniqueOrThrow({
      where: {
        eventId,
      },
      select: {
        hostId: true,
        eventType: true,
        athletesBoyOrGirl: true,
        athletesCompeting: {
          select: {
            boyOrGirl: true,
            events: true,
            groupName: true,
            userId: true,
            athleteId: true,
            teamName: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
        },
        staffMember: {
          select: {
            staffId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        host: {
          select: {
            teams: true,
          },
        },
        name: true,
        groupName: true,
        maxNumberOfAthletesPerTeam: true,
        locationName: true,
        date: true,
      },
    });

    if (event.hostId !== hostId) {
      return null;
    }

    return event;
  } catch (e) {
    return null;
  }
}

async function getAthleteData(
  hostId: string,
  groupName: string,
  boyOrGirl: BoyOrGirl,
) {
  try {
    const data = await prisma.athlete.findMany({
      where: {
        hostId,
        groupName,
        boyOrGirl,
      },
      select: {
        team: {
          select: {
            teamName: true,
          },
        },
        boyOrGirl: true,
        userId: true,
        events: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    const athletes: AthleteTableData[] = data.map(
      ({ team, boyOrGirl, userId, user, events }) => ({
        name: user.name,
        groupName,
        teamName: team.teamName,
        boyOrGirl,
        userId,
        email: user.email,
        numberOfEvents: events.length,
      }),
    );

    return athletes;
  } catch (error) {
    return [];
  }
}

async function getStaffData(hostId: string) {
  try {
    const { staff } = await prisma.host.findUniqueOrThrow({
      where: {
        hostId,
      },
      select: {
        staff: {
          select: {
            staffId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    return staff;
  } catch (e) {
    return [];
  }
}

const EditEvent = async ({ params }: { params: { eventId: string } }) => {
  const session = await getServerSession(authOptions);
  const userId = session!.user.userId;

  const hostId = await getHostId(userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const eventData = await getEventData(params.eventId, hostId!);

  if (eventData === null) {
    redirect(getURL("/events"));
  }

  const {
    name,
    groupName,
    athletesBoyOrGirl,
    athletesCompeting,
    maxNumberOfAthletesPerTeam,
    locationName: currentLocationName,
    staffMember: currentStaff,
    date: eventDate,
    host: eventHost,
  } = eventData!;

  const teamsBeingExceeded = getTeamsBeingExceeded(
    maxNumberOfAthletesPerTeam,
    athletesCompeting.map(({ teamName }) => ({ teamName })),
    eventHost.teams,
  );

  const allLocations = await getLocations(hostId!);
  const allStaff = await getStaffData(hostId!);

  const competingAthletesTableData: AthleteTableData[] = athletesCompeting.map(
    ({ userId, boyOrGirl, groupName, teamName, user, events }) => ({
      userId,
      name: user.name,
      numberOfEvents: events.length,
      boyOrGirl,
      email: user.email,
      groupName,
      teamName,
    }),
  );

  const competingAthletesIds = competingAthletesTableData.map(
    ({ userId }) => userId,
  );

  const allAthletesData: AthleteTableData[] = await getAthleteData(
    hostId!,
    groupName,
    athletesBoyOrGirl,
  );

  const availableAthletesData = allAthletesData.filter(
    ({ userId }) => !competingAthletesIds.includes(userId),
  );

  const bannerText = `${groupName} ${
    athletesBoyOrGirl === "BOY" ? "Boy's" : "Girl's"
  } ${name}`;

  return (
    <div>
      <Banner text={bannerText} />

      <div className="container mx-auto mt-2 space-y-5">
        {session?.user.role === "HOST" && (
          <div>
            <h2 className="text-xl font-semibold">Event Details</h2>
            <UpdateEventDetailsForm
              locationNames={allLocations.map(
                ({ locationName }) => locationName,
              )}
              currentLocationName={currentLocationName}
              eventId={params.eventId}
              staff={allStaff.map(({ staffId, user }) => ({
                staffId,
                staffName: user.name,
              }))}
              currentStaff={
                currentStaff
                  ? {
                      staffId: currentStaff.staffId,
                      staffName: currentStaff.user.name,
                    }
                  : undefined
              }
              currentDate={eventDate}
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold block">
            <span>Athletes Competing</span>
            {teamsBeingExceeded.length > 0 && (
              <div className="flex text-sm space-x-2 items-center">
                <AlertCircle className="text-red-500 h-6 w-6 ml-2" />
                <span>
                  The following teams have too many athletes competing:
                </span>
                {teamsBeingExceeded.map((teamName) => (
                  <span key={teamName} className="p-1 rounded-sm bg-muted">
                    {teamName}
                  </span>
                ))}
              </div>
            )}
          </h2>
          <RemoveAthletesFromEventDataTable
            eventId={params.eventId}
            data={competingAthletesTableData}
          />
        </div>

        <div>
          <h2 className="text-xl font-semibold">Available Athletes</h2>

          <AddAthletesToEventDataTable
            data={availableAthletesData}
            eventId={params.eventId}
          />
        </div>
        <div className="flex justify-end">
          <BackButton />
        </div>
      </div>
    </div>
  );
};

export default EditEvent;
