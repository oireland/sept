"use client";

import { FC, useState } from "react";
import host from "@/app/assets/images/host.svg";
import athlete from "@/app/assets/images/athlete.svg";
import staff from "@/app/assets/images/staff.svg";
import spectator from "@/app/assets/images/spectator.svg";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import Image from "next/image";

type descriptionCardData = {
  title: string;
  mainPoint: string;
  description: string;
  imageUrl: string;
};

const descriptionCardData: descriptionCardData[] = [
  {
    title: "Organising your Sports Day",
    mainPoint:
      "Every year the events at Sports Day tend to be the same, but that doesn't make organising it as easy as you'd hope. From signing students up and scheduling the events for the day to calculating the results, it can all be a lot to handle, requiring planning far ahead.",
    description:
      "With SEPT, all of this is managed in one place, with an easy to use interface for creating and editing events, managing athletes and the events they are competing in, having results recorded by staff and hosting a great day for everyone present.",
    imageUrl: host,
  },
  {
    title: "Athletes Signing Up for Events",
    mainPoint:
      "Hosting a sports day is an annual event for most schools, and every time without fail heads of houses and other staff are chasing pupils down to sign up for events.",
    description:
      "I'm sure as teachers you're tired of holding countless assemblies begging and pleading for students to sign up for Sports Day - I guarantee they're bored of them too! When you use SEPT, students can sign up for events themselves, and their places on the lineup are confirmed by you. This makes it easy for your students to show their interest, and you can easily update who is competing when last minute changes inevitably happen.",
    imageUrl: athlete,
  },
  {
    title: "Recording the Results of Events",
    mainPoint:
      "Printing off sheets for every event of the day is a task in itself, not to mention providing a clipboard and a few pens to every member of staff that's working an event, with the right sheets attached. Only to have a strong wind send sheets flying, or an absent pupil causing problems.",
    description:
      "With SEPT, staff have their own accounts, to which events are allocated. They enter the times, distances or whatever it may be for every student, and placements and points are automatically allocated. In addition, no results need to be collected in because they are added to the overall results as soon as results are saved.",
    imageUrl: staff,
  },
  {
    title: "Provide a Great Experience for All",
    mainPoint:
      "A lot of parents enjoy coming to Sports Day, to cheer on and support their children. However, this tends to be as involved as parents can get. Most of the time no overall score is available until the end of the day, when they'll hear it from their youngen in the car on the way home.",
    description:
      "With SEPT, spectators and athletes can have access to a real time leaderboard, organised by the teams/houses you have created. This makes the day more competitive for athletes who can 'have something to fight for' if their house is traiing behind or needing to maintain its lead, and parents can feel more included, even those who aren't able to attend in person.",
    imageUrl: spectator,
  },
];

const Carousel: FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const goToPrevious = () => {
    let isFirstSlide = currentSlide === 0;
    if (isFirstSlide) {
      setCurrentSlide(descriptionCardData.length - 1);
    } else {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const goToNext = () => {
    let isLastSlide = currentSlide === descriptionCardData.length - 1;
    if (isLastSlide) {
      setCurrentSlide(0);
    } else {
      setCurrentSlide(currentSlide + 1);
    }
  };

  return (
    <section className=" cursor-default py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28">
      <div className="flex justify-center">
        <h2 className="w-3/4 text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          How does <span className="text-brg">SEPT</span> help?
        </h2>
      </div>
      <div className="mt-3 flex justify-center sm:mt-5 md:mt-7 lg:mt-9 xl:mt-11">
        <HiChevronLeft
          onClick={goToPrevious}
          className="mx-auto my-auto h-8 w-8 cursor-pointer rounded-full opacity-50 transition duration-150 hover:opacity-100"
        />

        <div className="mx-auto block w-3/4 rounded-md border py-1 shadow-md transition duration-150 hover:shadow-xl md:flex md:py-2">
          <div className="hidden md:block">
            <div className="relative flex h-48 w-48 lg:h-60 lg:w-60 xl:h-72 xl:w-72 ">
              <Image
                src={descriptionCardData[currentSlide].imageUrl}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>
          <div className="px-2 py-1 lg:pr-4 xl:pr-10">
            <h3 className="text-lg font-semibold underline decoration-brg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl">
              {descriptionCardData[currentSlide].title}
            </h3>
            <p className="mt-1 text-sm font-semibold sm:text-base lg:mt-3 lg:text-lg xl:text-xl">
              {descriptionCardData[currentSlide].mainPoint}
            </p>
            <p className="mt-1 text-xs sm:text-sm lg:mt-2 lg:text-base xl:text-lg">
              {descriptionCardData[currentSlide].description}
            </p>
          </div>
        </div>
        <HiChevronRight
          onClick={goToNext}
          className="mx-auto my-auto h-8 w-8 cursor-pointer opacity-50 transition duration-150 hover:opacity-100"
        />
      </div>
    </section>
  );
};

export default Carousel;
