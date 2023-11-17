import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

const FloatingContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className="relative min-h-screen bg-platinum p-4">
      <div
        className={cn(
          "mx-auto h-fit w-5/6 max-w-3xl rounded-md bg-white px-3 py-2 shadow-sm",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};


export default FloatingContainer;
