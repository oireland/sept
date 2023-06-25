"use client";

import { SessionProvider } from "next-auth/react";
import React, { FC } from "react";

interface Props {
  children?: React.ReactNode;
}

export const NextAuthProvider: FC<Props> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
