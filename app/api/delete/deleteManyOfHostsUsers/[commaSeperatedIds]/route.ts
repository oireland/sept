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

    if (session?.user.role !== "HOST") {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 },
      );
    }

    await prisma.user.deleteMany({
      where: {
        host: {
          is: {
            userId: session.user.userId,
          },
        },
        userId: {
          in: idArray,
        },
      },
    });

    return NextResponse.json("Successfully deleted users");
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
