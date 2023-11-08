import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { id } from "date-fns/locale";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const validationSchema = yup.object({
  eventId: yup.string().required(),
  locationId: yup.string().required(),
});

export async function PATCH(req: Request) {
  try {
    const { eventId, locationId } = await validationSchema.validate(
      await req.json()
    );

    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised request", { status: 401 });
    }

    // update the event's location if the event and location belong to the host
    await prisma.event.update({
      where: {
        id: eventId,
        AND: {
          host: {
            userId: session.user.id,
          },
        },
      },
      data: {
        location: {
          connect: {
            locationId,
            AND: {
              host: {
                userId: session.user.id,
              },
            },
          },
        },
      },
    });

    return NextResponse.json("Location updated successfully");
  } catch (e) {
    console.log(e);
    return NextResponse.json(e, { status: 500 });
  }
}
