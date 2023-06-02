import { FC } from "react";

interface HeaderProps {}

const Header: FC<HeaderProps> = ({}) => {
  return (
    <div className="bg-white shadow-md flex items-center justify-between px-3 py-2 sticky top-0 z-50">
      <div>
        <h1 className="font-semibold text-xl md:text-2xl cursor-pointer">
          <span className="text-brg">7 </span> | SEPT
        </h1>
      </div>

      <div className="space-x-2">
        <button className="bg-white text-brg font-semibold border py-2 px-4 rounded-full text-sm md:text-lg duration-100">
          Login
        </button>
        <button className="bg-brg text-white font-semibold py-2 px-4 rounded-full text-sm md:text-lg duration-100">
          SignUp
        </button>
      </div>
    </div>
  );
};

export default Header;
