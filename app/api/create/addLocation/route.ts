import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  locationName: yup.string().required("Required"),
});

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const { locationName } = await validationSchema.validate(data);

    const session = await getServerSession(authOptions);

    if (session?.user.role !== "HOST") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // add location to the host's list of locations
    await prisma.location.create({
      data: {
        locationName,
        host: {
          connect: {
            userId: session.user.userId,
          },
        },
      },
    });

    return NextResponse.json(`${locationName} has been added succesfully!`);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      return NextResponse.json("There is already a location with this name.", {
        status: 400,
      });
    }
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
