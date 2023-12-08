import * as yup from "yup";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import getURL from "@/lib/getURL";
import { NextResponse } from "next/server";

const requestSchema = yup.object({
  email: yup.string().required().email(),
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function POST(req: Request) {
  const { email } = await requestSchema.validate(await req.json());

  try {
    const emailToken = jwt.sign({ email }, process.env.EMAIL_SECRET!, {
      expiresIn: "1d",
    });
    const url = getURL(`/resetPassword/${emailToken}`);

    await transporter.sendMail({
      to: email,
      subject: "Reset Password",
      html: `Please click below to reset your password: <a href="${url}">Click Here!<a/>`,
    });
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}
