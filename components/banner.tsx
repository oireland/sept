import React from "react";
import BackButton from "./BackButton";

type Props = {
  text: string;
  showBackButton?: boolean;
};

const Banner = ({ text, showBackButton = true }: Props) => {
  return (
    // <div className="flex h-[150px] items-center bg-platinum px-4 sm:h-[200px]  md:h-[250px] md:px-6 lg:h-[300px] lg:px-10">
    //   <h1 className=" mt-3 text-center text-2xl font-semibold text-brg sm:mt-8 sm:text-4xl md:mt-12 md:text-5xl lg:mt-16 lg:text-6xl ">
    //     {text}
    //   </h1>
    // </div>
    <div className="flex relative h-[150px] items-center bg-platinum px-4 sm:h-[200px]  md:h-[250px] md:px-6 lg:h-[300px] lg:px-10">
      <h1 className=" mt-3 text-center text-2xl font-semibold text-brg sm:mt-8 sm:text-4xl md:mt-12 md:text-5xl lg:mt-16 lg:text-6xl ">
        {text}
      </h1>
      {showBackButton && (
        <div className="absolute bottom-2 right-2">
          <BackButton />
        </div>
      )}
    </div>
  );
};

export default Banner;
