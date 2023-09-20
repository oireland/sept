import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import * as yup from "yup";

const requestSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  password: yup
    .string()
    .matches(
      /(?=^.{6,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/
    )
    .required(),
  role: yup.mixed<UserRole>().oneOf(Object.values(UserRole)).required(),
});

export async function POST(req: Request) {
  const { name, email, password, role } = await requestSchema.validate(
    await req.json()
  );

  try {
    const saltRound = 10;
    const hash = await bcrypt.hash(password, saltRound);

    switch (role) {
      case "HOST":
        const userHost = await prisma.user.create({
          data: {
            name,
            email,
            password: hash,
            role: role,
            host: {
              create: {
                name,
              },
            },
          },
        });
        return NextResponse.json(userHost);
      case "SPECTATOR":
        const userSpectator = await prisma.user.create({
          data: {
            name,
            email,
            password: hash,
            role: role,
            spectator: {
              create: {
                name,
              },
            },
          },
        });
        return NextResponse.json(userSpectator);

      default:
        return NextResponse.json({ message: "invalid role" }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
