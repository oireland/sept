import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";
import bcrypt from "bcrypt";
import { AthleteSchema } from "@/lib/yupSchemas";

const requestSchema = yup.object({
  athletes: yup.array(AthleteSchema),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "HOST") {
      throw new Error("Unauthorised User");
    }

    const { athletes } = await requestSchema.validate(await req.json());

    if (!athletes) {
      return NextResponse.json(
        { message: "No athletes provided" },
        { status: 400 }
      );
    }

    const teamSet = new Set<string>();
    const groupSet = new Set<string>();

    athletes.forEach(async ({ name, email, group, team, boyOrGirl }) => {
      teamSet.add(team);
      groupSet.add(group);

      const password = await bcrypt.hash(email, 10);

      await prisma.user.create({
        data: {
          name,
          email,
          password,
          role: "ATHLETE",
          athlete: {
            create: {
              name,
              group,
              team,
              boyOrGirl,
              host: {
                connect: {
                  userId: session.user.id,
                },
              },
            },
          },
        },
      });
    });

    // get the teams and groups that the host already has to add to the set
    const hostData = await prisma.host.findUnique({
      where: {
        userId: session.user.id,
      },
      select: {
        teams: true,
        groups: true,
      },
    });

    hostData?.teams.forEach((team) => {
      teamSet.add(team);
    });
    hostData?.groups.forEach((group) => {
      groupSet.add(group);
    });

    // update the host to include the full set of unique teams and groups
    await prisma.host.update({
      where: {
        userId: session.user.id,
      },
      data: {
        teams: {
          set: Array.from(teamSet),
        },
        groups: {
          set: Array.from(groupSet),
        },
      },
    });

    return NextResponse.json(
      { message: "Athletes successfully created" },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(e, { status: 500 });
  }
}
