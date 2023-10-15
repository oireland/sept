import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import axios from "axios";
import getURL from "./getURL";
import { VerificationToken } from "./token";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const user = await prisma.user.findUnique({
            where: {
              email: email,
            },
          });

          if (!user || !user.password) {
            throw new Error("Email or password are incorrect ");
          }

          let isCorrectPassword = await bcrypt.compare(password, user.password);

          if (!isCorrectPassword) {
            throw new Error("Email or password are incorrect ");
          }

          if (!user.isConfirmed) {
            const tokenData: VerificationToken = {
              email: user.email!,
              userId: user.id,
            };
            await axios.post(
              getURL("/api/auth/sendVerificationEmail"),
              tokenData
            );
          }
          return { id: user.id, name: user.name, email: user.email };
        } catch (e) {
          console.log(e);
          throw e;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.isConfirmed = token.isConfirmed;
        session.user.image = token.picture;
      }
      return session;
    },
    async jwt({ token }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
      });

      if (!dbUser) {
        throw new Error("User not in DB");
      }

      token.id = dbUser.id;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      token.isConfirmed = dbUser.isConfirmed;

      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
};
