import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { commaSeperatedIds: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const commaSeperatedIds = params.commaSeperatedIds;

    const idArray = commaSeperatedIds.split(",");

    if (!session?.user || session.user.role !== "HOST") {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 }
      );
    }

    idArray.forEach(async (id) => {
      // find the event that the request is attempting to delete, select the userId of its host.
      const event = await prisma.event.findUnique({
        where: {
          id,
        },
        select: {
          host: {
            select: {
              userId: true,
            },
          },
        },
      });

      // if no such event exists or if the currently signed in user is not the host of the event
      if (!event || event.host.userId !== session.user.id) {
        return NextResponse.json("Invalid request", { status: 400 });
      }

      await prisma.event.delete({
        where: {
          id,
        },
      });
    });

    return NextResponse.json({ message: "Success" });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
