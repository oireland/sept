import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { VerificationToken } from "@/lib/token";
import * as yup from "yup";
import getURL from "@/lib/getURL";

const saltRound = 10;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

const requestSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().required().email(),
  password: yup
    .string()
    .matches(
      /(?=^.{8,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/
    )
    .required(),
  role: yup.mixed().oneOf(Object.values(UserRole)).required(),
});

export async function POST(req: Request) {
  const { name, email, password, role } = (await requestSchema.validate(
    await req.json()
  )) as { name: string; email: string; password: string; role: UserRole };

  try {
    const hash = await bcrypt.hash(password, saltRound);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        role: role,
      },
    });

    const tokenData: VerificationToken = {
      userId: user.id,
      email: user.email!,
    };

    jwt.sign(
      tokenData,
      process.env.EMAIL_SECRET!,
      {
        expiresIn: "1d",
      },
      (err, emailToken) => {
        if (err) {
          console.log(err);
        } else {
          const url = getURL(`/confirm/${emailToken}`);

          transporter.sendMail(
            {
              to: tokenData.email,
              subject: "Confirm Email",
              html: `Please click this email to confirm your email: <a href="${url}">${url}<a/>`,
            },
            (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log(info.response);
              }
            }
          );
        }
      }
    );

    return NextResponse.json(user);
  } catch (e) {
    console.log("Error caught in createUser", e);
    return NextResponse.json(e, { status: 500 });
  }
}
