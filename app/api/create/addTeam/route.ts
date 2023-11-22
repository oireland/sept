import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  teamName: yup.string().required("Required"),
  teamColour: yup
    .string()
    .matches(
      /^#([0-9a-f]{3}|[0-9a-f]{6})$/i,
      "Team colour must be a valid hex code",
    )
    .required("Required"),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { teamName, teamColour } = await validationSchema.validate(data);

    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // create team with user's hostId
    await prisma.team.create({
      data: {
        teamName,
        hexColour: teamColour,
        host: {
          connect: {
            userId: session.user.userId,
          },
        },
      },
    });

    return NextResponse.json(`${teamName} has been added succesfully!`);
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
