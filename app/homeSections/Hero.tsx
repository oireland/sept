import Image from "next/image";
import { FC } from "react";
import banner from "/app/assets/images/banner.svg";
import Link from "next/link";
interface HeroProps {}

const Hero: FC<HeroProps> = ({}) => {
  return (
    <div className="grid h-[300px]  grid-cols-2 bg-platinum sm:h-[400px] md:h-[500px] lg:h-[600px] xl:h-[700px]">
      <div className=" px-4 md:px-6 lg:px-10">
        <h1 className=" mt-3 text-2xl font-semibold text-brg sm:mt-8 sm:text-3xl md:mt-12 md:text-5xl lg:mt-16 lg:text-6xl xl:text-7xl">
          Simplify Your Next Sports Day
        </h1>
        <h2 className=" mt-1 text-sm sm:mt-3 sm:text-lg md:mt-4 md:text-xl lg:mt-5 lg:text-2xl xl:text-3xl ">
          By managing all of your athletes, staff and events in one place with
          our
          <b> S</b>ports <b>E</b>vent <b>P</b>erformance <b>T</b>racker.
        </h2>
        <button className="mt-3 rounded-full border bg-white p-2 text-sm font-semibold text-brg shadow-sm transition duration-150 ease-in hover:shadow-xl active:scale-95 sm:mt-5 sm:text-lg md:mt-7 md:p-3  md:text-xl lg:mt-9 lg:p-4 lg:text-2xl xl:mt-11 xl:p-5 xl:text-3xl">
          <Link href="/signup">Start organising your next event</Link>
        </button>
      </div>
      <div className="relative">
        <Image
          src={banner}
          alt="An animated cartoon showing 3 athletes. One is doing the high jump, one hurdles, and the last a sprint."
          fill
          className="object-contain"
        />
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

export default Hero;
