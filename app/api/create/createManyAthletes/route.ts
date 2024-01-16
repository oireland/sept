import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";
import bcrypt from "bcrypt";
import { BoyOrGirl } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      throw new Error("Unauthorised User");
    }

    const { groups, teams, hostId } = await prisma.host.findUniqueOrThrow({
      where: {
        userId: session.user.userId,
      },
      select: {
        hostId: true,
        groups: {
          select: {
            groupName: true,
          },
        },
        teams: {
          select: {
            teamName: true,
          },
        },
      },
    });

    const allowedGroups = groups.map(({ groupName }) => groupName);
    const allowedTeams = teams.map(({ teamName }) => teamName);

    const AthleteSchema = yup
      .object({
        name: yup.string().required(),
        email: yup.string().required().email(),
        groupName: yup
          .string()
          .required()
          .test("isAllowedGroup", (group) => {
            return allowedGroups.includes(group);
          }),
        teamName: yup
          .string()
          .required()
          .test("isAllowedTeam", (team) => {
            return allowedTeams.includes(team);
          }),
        boyOrGirl: yup
          .mixed<BoyOrGirl>()
          .oneOf(Object.values(BoyOrGirl))
          .required(),
      })
      .required();

    const requestSchema = yup.object({
      athletes: yup.array().of(AthleteSchema).required(),
    });

    const { athletes } = await requestSchema.validate(await req.json());

    const start = new Date().getTime();

    await Promise.all(
      athletes.map(async ({ boyOrGirl, email, groupName, name, teamName }) => {
        // low number of salt rounds used since the hash needs to be quick
        const password = await bcrypt.hash(email, 4);

        return prisma.user.create({
          data: {
            email,
            name,
            password,
            role: "ATHLETE",
            athlete: {
              create: {
                boyOrGirl,
                group: {
                  connect: {
                    groupName_hostId: {
                      groupName,
                      hostId,
                    },
                  },
                },
                host: {
                  connect: {
                    hostId,
                  },
                },
                team: {
                  connect: {
                    teamName_hostId: {
                      teamName,
                      hostId,
                    },
                  },
                },
              },
            },
          },
        });
      }),
    );

    const end = new Date().getTime();

    console.log("Execution time w/ salt 4 (ms): ", end - start);

    return NextResponse.json(
      { message: "Athletes successfully created" },
      { status: 200 },
    );
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        "At least one of your athletes already has an account with the email address in the file",
        { status: 400 },
      );
    }
    return NextResponse.json(e, { status: 500 });
  }
}
