import * as yup from "yup";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const requestSchema = yup.object({
  password: yup
    .string()
    .matches(
      /(?=^.{6,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/
    )
    .required(),
  token: yup.string().required(),
});

const tokenSchema = yup.object({
  email: yup.string().required(),
});

export async function PATCH(req: Request) {
  try {
    const { password, token } = await requestSchema.validate(await req.json());

    const verifiedToken = jwt.verify(token, process.env.EMAIL_SECRET!);
    const { email } = await tokenSchema.validate(verifiedToken);

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json("Password reset successfully", { status: 200 });
  } catch (e) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
