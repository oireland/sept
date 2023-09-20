import Image from "next/image";
import React from "react";

type Props = {
  text: string;
  src: string;
  alt: string;
};

const Banner = ({ text, src, alt }: Props) => {
  return (
    <div className="grid h-[250px] grid-cols-2  bg-platinum sm:h-[300px] md:h-[350px] lg:h-[450px] xl:h-[500px]">
      <div className="flex items-center px-4 md:px-6 lg:px-10">
        <h1 className=" mt-3 text-2xl font-semibold text-brg sm:mt-8 sm:text-4xl md:mt-12 md:text-5xl lg:mt-16 lg:text-6xl xl:text-7xl">
          {text}
        </h1>
      </div>
      <div className="relative">
        <Image src={src} alt={alt} fill className="object-contain" />
        <a
          href="https://storyset.com/"
          target="_blank"
          className="absolute bottom-0 right-5 text-xs font-light text-gray-700"
        >
          Illustrations by Storyset
        </a>
      </div>
    </div>
  );
};

export default Banner;
