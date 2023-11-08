import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  locationName: yup.string().required("Required"),
});

export async function PATCH(req: Request) {
  try {
    console.log("before req.json");
    const data = await req.json();
    console.log("after req.json");

    const { locationName } = await validationSchema.validate(data);

    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "HOST") {
      return NextResponse.json("Unauthorised Request", { status: 401 });
    }

    // add location to the host's list of locations
    await prisma.host.update({
      where: {
        userId: session.user.id,
      },
      data: {
        locations: {
          create: {
            locationName,
          },
        },
      },
    });

    return NextResponse.json(`${locationName} has been added succesfully!`);
  } catch (e) {
    console.log(e);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
