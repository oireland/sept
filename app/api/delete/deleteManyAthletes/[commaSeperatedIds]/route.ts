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

    if (!session || session.user.role !== "HOST") {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 }
      );
    }

    idArray.forEach(async (id) => {
      // find the athlete that the request is attempting to delete, select the userId of its host.
      const athlete = await prisma.athlete.findUniqueOrThrow({
        where: {
          userId: id,
        },
        select: {
          host: {
            select: {
              userId: true,
            },
          },
        },
      });

      // if the currently signed in user is not the host of the athlete
      if (athlete.host.userId !== session.user.id) {
        return NextResponse.json("Invalid request", { status: 400 });
      }

      await prisma.user.delete({
        where: {
          id,
        },
      });
    });

    return NextResponse.json({ message: "Success" });
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
