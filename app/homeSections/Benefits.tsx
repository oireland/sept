import { FaRunning, FaStar, FaClipboard } from "react-icons/fa";
import { IconType } from "react-icons";

type benefitType = {
  Icon: IconType;
  benefit: string;
  feature: string;
};

const benefitsData: benefitType[] = [
  {
    Icon: FaRunning,
    benefit: "No more chasing people down",
    feature: "Athletes can add themselves",
  },
  {
    Icon: FaClipboard,
    benefit: "Easily record results",
    feature: "Allocate events to staff",
  },
  {
    Icon: FaStar,
    benefit: "See the leaderboard in real time",
    feature: "With the live scoreboard",
  },
];

const Benefits = () => {
  return (
    <section className="cursor-default bg-platinum px-2 py-10 sm:py-12 md:py-16 lg:py-20 xl:py-28">
      <div className="flex justify-center">
        <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          The benefits of using <span className="text-brg">SEPT</span>
        </h1>
      </div>

      <div className="mt-5 block space-y-8 sm:mt-8 sm:space-y-10 md:my-16 md:grid md:grid-cols-3 md:space-y-0 lg:my-20 xl:my-24">
        {benefitsData.map(({ Icon, benefit, feature }, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <Icon className="benefit-icon" />
            <h2 className="mt-3 text-lg font-semibold sm:text-xl md:mt-6 lg:mt-9 lg:text-2xl xl:mt-12 xl:text-3xl">
              {benefit}
            </h2>
            <h4 className="text-sm sm:text-base lg:text-lg xl:text-xl">
              {feature}
            </h4>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Benefits;
