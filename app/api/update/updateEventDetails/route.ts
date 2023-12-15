import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { id } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const validationSchema = yup.object({
  eventId: yup.string().required(),
  date: yup
    .date()
    .required()
    .test(
      "futureDate",
      "Date must be in the future",
      (date) => new Date() < date,
    ),
  locationName: yup.string().required(),
  staffId: yup.string(),
});

export async function PATCH(req: Request) {
  try {
    const { eventId, locationName, date, staffId } =
      await validationSchema.validate(await req.json());

    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised request", { status: 401 });
    }

    const hostId = await getHostId(session.user.userId, "HOST");

    if (hostId === null) {
      return NextResponse.json("Unauthorised request", { status: 401 });
    }

    // update the event's location if the event and location belong to the host
    await prisma.event.update({
      where: {
        eventId,
        host: {
          is: {
            userId: session.user.userId,
          },
        },
      },
      data: {
        location: {
          connect: {
            locationName_hostId: {
              hostId,
              locationName,
            },
            AND: {
              host: {
                userId: session.user.userId,
              },
            },
          },
        },
        staffMember: {
          connect: {
            staffId,
            AND: {
              host: {
                userId: session.user.userId,
              },
            },
          },
        },
        date,
      },
    });

    return NextResponse.json("Location updated successfully");
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
