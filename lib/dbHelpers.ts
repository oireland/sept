import { UserRole } from "@prisma/client";
import { prisma } from "./prisma";

export async function getHostId(userId: string, userRole: UserRole) {
  try {
    if (userRole === "HOST") {
      const { id } = await prisma.host.findUniqueOrThrow({
        where: {
          userId,
        },
        select: {
          id: true,
        },
      });
      return id;
    } else if (userRole === "STAFF") {
      const { hostId } = await prisma.staff.findUniqueOrThrow({
        where: {
          userId,
        },
        select: {
          hostId: true,
        },
      });
      return hostId;
    }
    return null;
  } catch (error) {
    return null;
  }
}
