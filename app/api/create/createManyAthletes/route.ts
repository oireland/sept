import { prisma } from "@/lib/prisma";
import { BoyOrGirl, UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const requestSchema = yup.array().of(
  yup.object({
    name: yup.string().required(),
    email: yup.string().required().email(),
    group: yup.string().required(),
    team: yup.string().required(),
    boyOrGirl: yup
      .mixed<BoyOrGirl>()
      .oneOf(Object.values(BoyOrGirl))
      .required(),
  })
);

export async function POST(req: Request) {
  const session = await getServerSession();
  const request = await req.json();
  console.log(request);
  const athletes = await requestSchema.validate(request);

  try {
    if (session?.user.role === "HOST") {
      athletes?.forEach(async ({ name, email, group, team, boyOrGirl }) => {
        await prisma.user.create({
          data: {
            name,
            email,
            role: "ATHLETE",
            athlete: {
              create: {
                boyOrGirl,
                name,
                group,
                team,
                hostId: session.user.id,
              },
            },
          },
        });
      });
    }
    return NextResponse.json(
      { message: "Athletes successfully created" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
