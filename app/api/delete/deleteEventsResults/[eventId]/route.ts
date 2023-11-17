import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "STAFF") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // delete all results for the event (if the user is the staff of the event)
    await prisma.result.deleteMany({
      where: {
        event: {
          eventId: params.eventId,
          AND: {
            staffMember: {
              userId: session.user.userId,
            },
          },
        },
      },
    });
    return NextResponse.json("Deleted Results");
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
