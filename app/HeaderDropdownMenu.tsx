"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@prisma/client";
import { ChevronDown, LogOutIcon, User2Icon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

const HeaderDropdownMenu = ({
  userId,
  userRole,
}: {
  userId: string;
  userRole: UserRole;
}) => {
  return (
    <div className="h-full  ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="h-full">
          <div className="flex cursor-pointer items-center pr-3">
            <span className="text-base md:text-lg">Menu</span>
            <ChevronDown className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="p-0">
            <Link
              href="/dashboard"
              className="h-full w-full px-2 py-1.5 text-sm md:text-base "
            >
              Dashboard
            </Link>
          </DropdownMenuItem>
          {userRole === "HOST" ? (
            <>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/athletes"
                  className="h-full w-full px-2 py-1.5 text-sm md:text-base "
                >
                  Athletes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/staff"
                  className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                >
                  Staff
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/groups"
                  className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                >
                  Groups
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/teams"
                  className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                >
                  Teams
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/locations"
                  className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                >
                  Locations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/events"
                  className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                >
                  Events
                </Link>
              </DropdownMenuItem>
            </>
          ) : userRole === "STAFF" ? (
            <>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/athletes"
                  className="h-full w-full px-2 py-1.5 text-sm md:text-base "
                >
                  Athletes
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/events"
                  className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                >
                  All Events
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0">
                <Link
                  href="/staffEvents"
                  className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
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
                    href={`/athletes/${userId}`}
                    className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                  >
                    My Events
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-0">
                  <Link
                    href={`/results/${userId}`}
                    className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
                  >
                    My Results
                  </Link>
                </DropdownMenuItem>
              </>
            )
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
            <Link
              href="/account"
              className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
            >
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
            <Link
              href="/"
              className="h-full  w-full px-2 py-1.5 text-sm md:text-base "
            >
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
