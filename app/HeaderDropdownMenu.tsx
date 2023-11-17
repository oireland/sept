"use client";
import { FC } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ChevronDown, LogOutIcon, User2Icon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderDropdownMenu: FC = () => {
  const session = useSession();
  const userRole = session.data?.user.role;

  return (
    <div className="h-full  ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="h-full">
          <div className="flex cursor-pointer items-center pr-3">
            <span>Menu</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="p-0">
            <Link href="/dashboard" className="h-full w-full px-2 py-1.5  ">
              Dashboard
            </Link>
          </DropdownMenuItem>
          {userRole === "HOST" ? (
            <>
              <DropdownMenuItem className="p-0">
                <Link href="/athletes" className="h-full w-full px-2 py-1.5 ">
                  Athletes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/staff" className="h-full  w-full px-2 py-1.5 ">
                  Staff
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/locations" className="h-full  w-full px-2 py-1.5 ">
                  Locations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/events" className="h-full  w-full px-2 py-1.5 ">
                  Events
                </Link>
              </DropdownMenuItem>
            </>
          ) : userRole === "STAFF" ? (
            <>
              <DropdownMenuItem className="p-0">
                <Link href="/athletes" className="h-full w-full px-2 py-1.5 ">
                  Athletes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link href="/events" className="h-full  w-full px-2 py-1.5 ">
                  All Events
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/staffEvents"
                  className="h-full  w-full px-2 py-1.5 "
                >
                  My Events
                </Link>
              </DropdownMenuItem>
            </>
          ) : (
            userRole === "ATHLETE" && (
              <>
                <DropdownMenuItem className="p-0">
                  <Link
                    href={`/athletes/${session.data!.user.userId}`}
                    className="h-full  w-full px-2 py-1.5 "
                  >
                    My Events
                  </Link>
                </DropdownMenuItem>
              </>
            )
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Link href="/account" className="h-full  w-full px-2 py-1.5 ">
              <div className="flex items-center space-x-2">
                <h6>Account</h6>
                <User2Icon className="h-4 w-4" />
              </div>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              signOut({ redirect: false });
            }}
            className="cursor-pointer p-0"
          >
            <Link href="/" className="h-full  w-full px-2 py-1.5 ">
              <div className="flex items-center space-x-2">
                <h6>Sign Out</h6>
                <LogOutIcon className="h-4 w-4" />
              </div>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default HeaderDropdownMenu;
