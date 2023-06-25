import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const session = await getServerSession(authOptions);
  console.log(session);
  return (
    <div>
      <p>Welcome {session?.user.name}</p>
      <p>You are a {session?.user.role}</p>
    </div>
  );
};

export default page;
