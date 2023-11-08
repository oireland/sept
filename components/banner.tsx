import React from "react";

type Props = {
  text: string;
};

const Banner = ({ text }: Props) => {
  return (
    <div className="flex h-[150px] items-center bg-platinum px-4 sm:h-[200px]  md:h-[250px] md:px-6 lg:h-[300px] lg:px-10">
      <h1 className=" mt-3 text-center text-2xl font-semibold text-brg sm:mt-8 sm:text-4xl md:mt-12 md:text-5xl lg:mt-16 lg:text-6xl ">
        {text}
      </h1>
    </div>
  );
};

export default Banner;
