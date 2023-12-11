import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { commaSeperatedNames: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    const commaSeperatedNames = params.commaSeperatedNames;

    const nameArray = commaSeperatedNames.split(",");

    if (session?.user.role !== "HOST") {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 },
      );
    }

    await prisma.group.deleteMany({
      where: {
        host: {
          is: {
            userId: session.user.userId,
          },
        },

        groupName: {
          in: nameArray,
        },
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json("You cannot delete a group that has athletes.", {
        status: 400,
      });
    }
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
