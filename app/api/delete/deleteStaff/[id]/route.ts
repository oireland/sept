import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  id: yup.string().required(),
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const idToBeDeleted = params.id;

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 }
      );
    }

    if (session.user.role !== "HOST") {
      return NextResponse.json(
        { message: "Unauthorised request" },
        { status: 401 }
      );
    }

    // find the staff that the request is attempting to delete, select the userId of its host.
    const staff = await prisma.staff.findUnique({
      where: {
        userId: idToBeDeleted,
      },
      select: {
        host: {
          select: {
            userId: true,
          },
        },
      },
    });

    // if no staff member exists with that ID
    if (!staff) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    // if the currently signed in user is not the host of the staff
    if (staff.host.userId !== session.user.id) {
      return NextResponse.json("Invalid request", { status: 400 });
    }

    await prisma.user.delete({
      where: {
        id: idToBeDeleted,
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
