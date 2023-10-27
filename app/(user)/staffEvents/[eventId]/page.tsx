import React from "react";
import Banner from "../../banner";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BoyOrGirl, UserRole } from "@prisma/client";
import { AthleteTableData } from "../../athletes/columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getHostId } from "@/lib/dbHelpers";
import BackButton from "@/components/BackButton";
import EnterResultsForm from "./EnterResultsForm";
import FloatingContainer from "@/components/FloatingContainer";
import InfoDialog from "./infoDialog";

async function getEventData(eventId: string, hostId: string) {
  try {
    const event = await prisma.event.findUniqueOrThrow({
      where: {
        id: eventId,
      },
      select: {
        hostId: true,
        eventType: true,
        athletesBoyOrGirl: true,
        athletesCompeting: {
          select: {
            name: true,
            boyOrGirl: true,
            group: true,
            userId: true,
            id: true,
            team: true,
            hostId: true,
          },
        },
        name: true,
        group: true,
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

const EnterEventResults = async ({
  params,
}: {
  params: { eventId: string };
}) => {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const hostId = await getHostId(userId, session!.user.role);

  if (hostId === null) {
    redirect(getURL("/"));
  }

  const eventData = await getEventData(params.eventId, hostId);

  if (eventData === null) {
    redirect(getURL("/events"));
  }

  const { name, group, athletesBoyOrGirl, athletesCompeting, eventType } =
    eventData;

  const titleText = `${group} ${
    athletesBoyOrGirl === "BOY" ? "Boy's" : "Girl's"
  } ${name}`;

  return (
    <div>
      <FloatingContainer className="p-4">
        <div className="flex items-center justify-between">
          <div></div>
          <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
            {titleText}
          </h2>
          <InfoDialog />
        </div>

        <EnterResultsForm
          athletes={athletesCompeting}
          eventId={params.eventId}
          eventType={eventType}
        />
      </FloatingContainer>
    </div>
  );
};

export default EnterEventResults;
