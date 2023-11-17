import { UserRole, User } from "@prisma/client";

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: UserRole;
    emailVerified: Date | null;
  }
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
