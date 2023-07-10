"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FC, useEffect } from "react";

interface pageProps {}

const Dashboard: FC<pageProps> = ({}) => {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });

  if (!session.data?.user.isConfirmed) {
    redirect("/confirm");
  }

  const user = session.data?.user;

  return (
    <div>
      <p>Welcome {user?.name}</p>
      <p>You are a {user?.role}</p>
      <p>Your email is {user?.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default Dashboard;
