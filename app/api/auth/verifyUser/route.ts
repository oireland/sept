import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { VerificationToken } from "@/lib/token";

export async function PATCH(req: Request) {
  const { token } = (await req.json()) as { token: string };

  try {
    const { userId, email } = jwt.verify(
      token,
      process.env.EMAIL_SECRET!
    ) as VerificationToken;

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date().toISOString(), isConfirmed: true },
    });

    return NextResponse.json(
      { userId, email },
      { status: 200, statusText: `Your email ${email} has been verified.` }
    );
  } catch (e) {
    return NextResponse.json(
      {},
      { status: 400, statusText: "Failed to confirm the email address." }
    );
  }
}
