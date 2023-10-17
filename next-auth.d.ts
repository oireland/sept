import { UserRole, User } from "@prisma/client";

type UserId = string;

declare module "next-auth/jwt" {
  interface JWT {
    id: UserId;
    role: UserRole;
    isConfirmed: boolean;
  }
}

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
