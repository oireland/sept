import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";
import * as bcrypt from "bcrypt";

const requestSchema = yup.object({
  oldPassword: yup.string().required(),
  newPassword: yup
    .string()
    .matches(
      /(?=^.{6,20}$)((?=.*\w)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[|!"$%&\/\(\)\?\^\'\\\+\-\*]))^.*/,
    )
    .required()
    .test("different-new-password", function (value) {
      return this.parent.oldPassword !== value;
    }),
  name: yup.string().required(),
  email: yup.string().email().required(),
});

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    const { oldPassword, newPassword, email, name } =
      await requestSchema.validate(await req.json());

    const { password } = await prisma.user.findUniqueOrThrow({
      where: {
        userId: session.user.userId,
      },
      select: {
        password: true,
      },
    });

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, password);

    if (!isOldPasswordCorrect) {
      return NextResponse.json("Invalid Request", { status: 400 });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    if (email !== session.user.email) {
      // the user is changing their email, so must verify it again
      await prisma.user.update({
        where: {
          userId: session.user.userId,
        },
        data: {
          password: hashedNewPassword,
          email,
          name,
          emailVerified: null,
        },
      });
    } else {
      await prisma.user.update({
        where: {
          userId: session.user.userId,
        },
        data: {
          password: hashedNewPassword,
          name,
        },
      });
    }
    return NextResponse.json("Password updated", { status: 200 });
  } catch (e) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
