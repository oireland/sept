import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { VerificationToken } from "@/lib/token";
import * as yup from "yup";

const requestSchema = yup.object({
  token: yup.string().required(),
});

export async function PATCH(req: Request) {
  const { token } = await requestSchema.validate(await req.json());

  try {
    const { userId, email } = jwt.verify(
      token,
      process.env.EMAIL_SECRET!,
    ) as VerificationToken;

    console.log(userId, email);

    await prisma.user.update({
      where: { userId },
      data: { emailVerified: new Date().toISOString() },
    });

    return NextResponse.json(
      { userId, email },
      { status: 200, statusText: `Your email ${email} has been verified.` },
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(e, {
      status: 400,
      statusText: "Failed to confirm the email address.",
    });
  }
}
