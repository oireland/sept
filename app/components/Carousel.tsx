"use client";

import { FC, useState } from "react";
import host from "../assets/images/host.svg";
import athlete from "../assets/images/athlete.svg";
import staff from "../assets/images/staff.svg";
import spectator from "../assets/images/spectator.svg";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

interface CarouselProps {}

type descriptionCardData = {
  title: string;
  description: string;
  imageUrl: string;
};

const descriptionCardData: descriptionCardData[] = [
  {
    title: "As a Host",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus animi ad nostrum eveniet. Aut, dolorum. Cumque, aspernatur officiis rerum magnam fuga repudiandae adipisci eveniet architecto ipsum libero earum tempore error!",
    imageUrl: host,
  },
  {
    title: "As an Athlete",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus animi ad nostrum eveniet. Aut, dolorum. Cumque, aspernatur officiis rerum magnam fuga repudiandae adipisci eveniet architecto ipsum libero earum tempore error!",
    imageUrl: athlete,
  },
  {
    title: "As a Staff Member",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus animi ad nostrum eveniet. Aut, dolorum. Cumque, aspernatur officiis rerum magnam fuga repudiandae adipisci eveniet architecto ipsum libero earum tempore error!",
    imageUrl: staff,
  },
  {
    title: "As a Spectator",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus animi ad nostrum eveniet. Aut, dolorum. Cumque, aspernatur officiis rerum magnam fuga repudiandae adipisci eveniet architecto ipsum libero earum tempore error!",
    imageUrl: spectator,
  },
];

const Carousel: FC<CarouselProps> = ({}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

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
    <div className="flex justify-center">
      <ChevronLeftIcon
        onClick={goToPrevious}
        className="h-8 rounded-full my-auto mx-auto cursor-pointer opacity-50 hover:opacity-100 transition duration-150"
      />

      <div className="block md:flex w-2/3 mx-auto shadow-sm hover:shadow-lg duration-150 transition rounded-md">
        <div className="hidden md:block">
          <div className="relative flex h-28 w-28 lg:h-48 lg:w-48">
            <Image
              src={descriptionCardData[currentSlide].imageUrl}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
        <div className="px-2 py-1">
          <h1 className="text-lg mb-1 font-semibold md:text-xl lg:text-2xl">
            {descriptionCardData[currentSlide].title}
          </h1>
          <p className="text-sm">
            {descriptionCardData[currentSlide].description}
          </p>
        </div>
      </div>
      <ChevronRightIcon
        onClick={goToNext}
        className="h-8 my-auto mx-auto cursor-pointer opacity-50 hover:opacity-100 transition duration-150"
      />
    </div>
  );
};

export default Carousel;
