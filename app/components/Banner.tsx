import Image from "next/image";
import { FC } from "react";
import banner from "../assets/images/banner.svg";

interface BannerProps {}

const Banner: FC<BannerProps> = ({}) => {
  return (
    <div className="relative h-[300px] md:[400px] lg:h-[450px] border">
      <Image
        src={banner}
        alt="Athletics image"
        fill
        className="object-contain "
      />
      <div className="absolute top-1/3 w-full text-center">
        <button className="text-brg text-sm bg-white my-3 px-10 py-4 shadow-md rounded-full font-bold hover:shadow-xl active:scale-90 transition duration-150">
          Get Started
        </button>
      </div>
      <a
        className="text-xs bottom-0 absolute right-2 font-extralight text-gray-400 "
        href="https://storyset.com/"
        target="_blank"
      >
        Illustrations by Storyset
      </a>
    </div>
  );
};

export default Banner;
