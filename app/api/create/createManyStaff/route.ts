import { authOptions } from "@/lib/auth";
import { StaffSchema } from "@/lib/yupSchemas";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";
import * as bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

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

    staff.forEach(async ({ name, email }) => {
      const password = await bcrypt.hash(email, 10);

      await prisma.user.create({
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
    });

    return NextResponse.json(
      { message: "Staff successfully created" },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(e, { status: 500 });
  }
}
