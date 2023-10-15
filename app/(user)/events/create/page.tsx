import FloatingContainer from "@/components/FloatingContainer";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import React from "react";
import EventForm from "./EventForm";
import { redirect } from "next/navigation";
import getURL from "@/lib/getURL";

async function getGroups(userId: string) {
  try {
    const data = await prisma.host.findUnique({
      where: {
        userId,
      },
      select: {
        groups: true,
      },
    });

    return data?.groups || [];
  } catch (error) {
    return [];
  }
}

const CreateEvent = async () => {
  const session = await getServerSession(authOptions);

  if (session?.user.role !== "HOST") {
    redirect(getURL("/"));
  }

  const groups = await getGroups(session!.user.id);

  return (
    <FloatingContainer className="p-4">
      <h2 className="mt-2 text-center text-xl font-semibold text-brg sm:text-2xl">
        Create an Event
      </h2>
      <EventForm groups={groups} />
    </FloatingContainer>
  );
};

export default CreateEvent;
