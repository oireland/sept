import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  groupName: yup.string().required("Required"),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { groupName } = await validationSchema.validate(data);

    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    await prisma.group.create({
      data: {
        groupName,
        host: {
          connect: {
            userId: session.user.userId,
          },
        },
      },
    });
    return NextResponse.json(`${groupName} has been added succesfully!`);
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
