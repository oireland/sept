import Link from "next/link";
import Banner from "../banner";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  return (
    <div>
      <Banner text="Dashboard" />
      <div>
        <h1>Manage Athletes:</h1>
        <Button asChild variant={"outline"}>
          <Link href="/athletes">Go</Link>
        </Button>
      </div>
      {session?.user.role === "HOST" ? (
        <div>
          <h1>Manage Staff:</h1>
          <Button asChild variant={"outline"}>
            <Link href="/staff">Go</Link>
          </Button>
        </div>
      ) : session?.user.role === "STAFF" ? (
        <div>
          <h1>Your Events:</h1>
          <Button asChild variant={"outline"}>
            <Link href="/staffEvents">Go</Link>
          </Button>
        </div>
      ) : null}
      <div>
        <h1>Manage Events:</h1>
        <Button asChild variant={"outline"}>
          <Link href="/events">Go</Link>
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
