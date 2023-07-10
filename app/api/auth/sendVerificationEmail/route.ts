import * as yup from "yup";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { VerificationToken } from "@/lib/token";
import getURL from "@/lib/getURL";
import { NextResponse } from "next/server";

const requestSchema = yup.object({
  email: yup.string().required().email(),
  userId: yup.string().required(),
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(req: Request) {
  const { email, userId } = await requestSchema.validate(await req.json());

  const tokenData: VerificationToken = {
    email,
    userId,
  };

  try {
    const emailToken = jwt.sign(tokenData, process.env.EMAIL_SECRET!, {
      expiresIn: "1d",
    });
    const url = getURL(`/confirm/${emailToken}`);

    transporter.sendMail({
      to: tokenData.email,
      subject: "Confirm Email",
      html: `Please click below to confirm your email: <a href="${url}">Click Here!<a/>`,
    });
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
