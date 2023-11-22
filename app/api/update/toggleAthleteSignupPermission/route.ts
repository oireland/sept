import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.object({
  isAllowed: yup.boolean().required(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    const { isAllowed } = await requestSchema.validate(await req.json());

    await prisma.host.update({
      where: {
        userId: session.user.userId,
      },
      data: {
        allowAthleteEventSignUp: isAllowed,
      },
    });
    return NextResponse.json("Updated Successfully");
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
