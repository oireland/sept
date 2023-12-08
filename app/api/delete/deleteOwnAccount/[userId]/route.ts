import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const session = await getServerSession(authOptions);

    const userId = params.userId;

    if (session?.user.userId !== userId) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    await prisma.user.delete({
      where: {
        userId,
      },
    });

    return NextResponse.json("Account deleted");
  } catch (e) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
