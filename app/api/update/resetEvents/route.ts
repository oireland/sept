import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    const athleteIds = (
      await prisma.host.findUniqueOrThrow({
        where: {
          userId: session.user.userId,
        },
        select: {
          athletes: {
            select: {
              athleteId: true,
            },
          },
        },
      })
    ).athletes.map(({ athleteId }) => athleteId);

    await prisma.$executeRaw`DELETE FROM "_Athletes - Events" WHERE "A" IN (${Prisma.join(
      athleteIds,
    )})`;

    await prisma.result.deleteMany({
      where: {
        athleteId: {
          in: athleteIds,
        },
      },
    });

    return NextResponse.json("Successfully reset events.");
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
