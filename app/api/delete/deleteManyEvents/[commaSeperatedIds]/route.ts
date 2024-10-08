import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { commaSeperatedIds: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const commaSeperatedIds = params.commaSeperatedIds;

    const idArray = commaSeperatedIds.split(",");

    if (!session?.user || session.user.role !== "HOST") {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 },
      );
    }

    await prisma.event.deleteMany({
      where: {
        eventId: {
          in: idArray,
        },

        host: {
          is: {
            userId: session.user.userId,
          },
        },
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
