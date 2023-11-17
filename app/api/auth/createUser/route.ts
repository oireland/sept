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
});

export async function POST(req: Request) {
  const { name, email, password } = await requestSchema.validate(
    await req.json()
  );

  try {
    const saltRound = 10;
    const hash = await bcrypt.hash(password, saltRound);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role: "HOST",
        host: {
          create: {},
        },
      },
    });

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
