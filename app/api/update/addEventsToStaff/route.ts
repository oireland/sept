import { authOptions } from "@/lib/auth";
import { getHostId } from "@/lib/dbHelpers";
import { prisma } from "@/lib/prisma";
import { EventTableDataSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  selectedRowData: yup.array().of(EventTableDataSchema).required(),
  staffUserId: yup.string().required(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !(session.user.role === "HOST")) {
      return NextResponse.json("Unauthorised request", { status: 401 });
    }

    const { selectedRowData: events, staffUserId } =
      await requestSchema.validate(await req.json());

    const staffHostId = await getHostId(staffUserId, "STAFF");

    const hostId = await getHostId(session.user.userId, session.user.role);

    if (hostId === null || staffHostId === null || hostId !== staffHostId) {
      return NextResponse.json("Invalid request", { status: 400 });
    }
    // update each event to have the staff member
    await Promise.all(
      events?.map(({ eventId }) =>
        prisma.event.update({
          where: {
            eventId,
            hostId,
          },
          data: {
            staffMember: {
              connect: {
                userId: staffUserId,
              },
            },
          },
        }),
      ),
    );

    return NextResponse.json("Successfully added events to staff", {
      status: 200,
    });
  } catch (e) {
    if (e instanceof Error) {
      return NextResponse.json(e.message, { status: 400 });
    } else {
      return NextResponse.json("Something went wrong", { status: 500 });
    }
  }
}
