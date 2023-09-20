"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FC } from "react";

import dashboard from "@/app/assets/images/dashboard.svg";
import Link from "next/link";
import Banner from "../banner";
import { Button } from "@/components/ui/button";

interface pageProps {}

const Dashboard: FC<pageProps> = ({}) => {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/signin");
    },
  });
  console.log(session.data?.user);

  if (!session.data?.user.isConfirmed) {
    redirect("/confirm");
  }

  const user = session.data?.user;

  return (
    <div>
      <Banner
        text={user.name + "'s Sports Day"}
        src={dashboard}
        alt="A man sitting at a control desk"
      />
      <div>
        <h1>Manage Athletes:</h1>
        <Button variant={"outline"}>
          <Link href="/athletes">Go</Link>
        </Button>
      </div>
      <div>
        <h1>Manage Staff:</h1>
        <Button variant={"outline"}>
          <Link href="/staff">Go</Link>
        </Button>
      </div>
      <div>
        <h1>Manage Events:</h1>
        <Button variant={"outline"}>
          <Link href="/events">Go</Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
