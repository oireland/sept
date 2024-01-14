import { authOptions } from "@/lib/auth";
import { StaffSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";
import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const requestSchema = yup.object({
  staff: yup.array(StaffSchema),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "HOST") {
      throw new Error("Unauthorised User");
    }

    const request = await req.json();
    const { staff } = await requestSchema.validate(request);

    if (!staff) {
      return NextResponse.json({ message: "Empty Request" }, { status: 400 });
    }

    await Promise.all(
      staff.map(async ({ name, email }) => {
        const password = await bcrypt.hash(email, 10);

        return prisma.user.create({
          data: {
            name,
            email,
            password,
            role: "STAFF",
            staff: {
              create: {
                host: {
                  connect: {
                    userId: session.user.userId,
                  },
                },
              },
            },
          },
        });
      }),
    );

    return NextResponse.json("Staff successfully created", { status: 200 });
  } catch (e) {
    console.log(e);
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json(
        "At least one of the staff members you are trying to sign up already has an account.",
        { status: 400 },
      );
    }
    return NextResponse.json(e, { status: 500 });
  }
}
