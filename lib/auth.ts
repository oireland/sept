import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcrypt";
import axios from "axios";
import getURL from "./getURL";
import { VerificationToken } from "./token";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";

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

          const user = await prisma.user.findUniqueOrThrow({
            where: {
              email: email,
            },
          });

          let isCorrectPassword = await bcrypt.compare(password, user.password);

          if (!isCorrectPassword) {
            throw new Error("Email or password are incorrect ");
          }

          if (!user.emailVerified) {
            if (user.role === "HOST") {
              const tokenData: VerificationToken = {
                email: user.email!,
                userId: user.userId,
              };
              await axios.post(
                getURL("/api/auth/sendVerificationEmail"),
                tokenData,
              );
            } else {
              await axios.post(getURL("/api/auth/sendPasswordResetEmail"), {
                email,
              });
            }
          }
          return {
            id: user.userId,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
          };
        } catch (e) {
          if (e instanceof PrismaClientInitializationError) {
            throw new Error("Connection Error");
          }
          throw e;
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.email = token.email!;
        session.user.userId = token.userId;
        session.user.name = token.name!;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
        session.user.image = token.picture || null;
      }
      return session;
    },
    async jwt({ token }) {
      const dbUser = await prisma.user.findUniqueOrThrow({
        where: {
          email: token.email!,
        },
        select: {
          userId: true,
          name: true,
          email: true,
          image: true,
          role: true,
          emailVerified: true,
        },
      });

      token.userId = dbUser.userId;
      token.name = dbUser.name;
      token.email = dbUser.email;
      token.picture = dbUser.image;
      token.role = dbUser.role;
      token.emailVerified = dbUser.emailVerified;

      return token;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
};
