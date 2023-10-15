import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  commaSeperatedIds: yup.string().required(),
});

export async function DELETE(
  req: Request,
  { params }: { params: { commaSeperatedIds: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const commaSeperatedIds = params.commaSeperatedIds;

    const idArray = commaSeperatedIds.split(",").map((id) => ({
      id,
    }));

    const validatedIdArray = await yup
      .array(
        yup.object({
          id: yup.string().required(),
        })
      )
      .validate(idArray);

    if (!validatedIdArray) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

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

    validatedIdArray.forEach(async ({ id }) => {
      // find the athlete that the request is attempting to delete, select the userId of its host.
      const staff = await prisma.staff.findUnique({
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

      // if no such athlete exists
      if (!staff) {
        return NextResponse.json("Invalid request", { status: 400 });
      }

      // if the currently signed in user is not the host of the athlete
      if (staff.host.userId !== session.user.id) {
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
    console.log(e);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
