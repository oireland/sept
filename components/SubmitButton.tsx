import React from "react";
import { twMerge } from "tailwind-merge";

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  type?: "submit" | "button";
}

const FormNavigationButton = ({
  className,
  children,
  type = "button",
  ...props
}: Props) => {
  return (
    <button
      type={type}
      className={twMerge(
        "rounded-xl border border-brg bg-brg bg-opacity-75 px-3 py-1 text-white transition duration-200 hover:bg-opacity-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default FormNavigationButton;
