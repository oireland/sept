import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { commaSeperatedNames: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const commaSeperatedNames = params.commaSeperatedNames;

    const nameArray = commaSeperatedNames.split(",");

    if (session?.user.role !== "HOST") {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 }
      );
    }

    await prisma.location.deleteMany({
      where: {
        host: {
          userId: session.user.userId,
        },
        AND: {
          locationName: {
            in: nameArray,
          },
        },
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
