import Banner from "@/components/banner";
import React from "react";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getHostId, getLocations } from "@/lib/dbHelpers";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

const LocationForm = dynamic(() => import("./LocationForm"));
const LocationDataTable = dynamic(() => import("./LocationDataTable"));

const Locations = async () => {
  const session = await getServerSession(authOptions);
  const hostId = await getHostId(session!.user.userId, "HOST");
  if (!hostId) {
    redirect("/");
  }
  const locations = await getLocations(hostId!);
  return (
    <div>
      <Banner text="Locations" />

      <div className="container px-10 py-4">
        <h2 className="mb-2 text-xl font-semibold">Add a new Location</h2>
        <LocationForm />

        <hr className="my-2" />
        <h2 className="mb-2 text-xl font-semibold">Your Locations</h2>

        <LocationDataTable
          data={locations.map(({ locationName, events }) => ({
            locationName,
            numberOfEvents: events.length,
          }))}
        />
      </div>
    </div>
  );
};

export default Locations;
