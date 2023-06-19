import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "../components/navigation";

const Home = () => {
  return (
    <>
      <Navigation />
      <div className="flex justify-center items-center min-h-screen">
        <div className="m-[24px] grid justify-items-center">
          <h1 className="text-[42px] text-center mb-[50px] text-green-300">
            Do you have an account?
          </h1>
          <div className="grid grid-cols-2 gap-x-[30px]">
            <Link
              href="/sign-in"
              className="p-[16px] border border-[#aaa] grid bg-[#fff] drop-shadow-2xl"
            >
              <h2 className="text-[36px] text-center mb-[12px]">
                Alredy have an account?
              </h2>
              <h3 className="text-[24px] text-[#aaa] font-light text-center mb-[24px]">
                Sign In
              </h3>
            </Link>
            <Link
              href="/sign-up"
              className="p-[16px] border border-[#aaa] grid bg-[#fff] drop-shadow-2xl"
            >
              <h2 className="text-[36px] text-center mb-[12px]">
                Don't have an account?
              </h2>
              <h3 className="text-[24px] text-[#aaa] font-light text-center mb-[24px]">
                Sign Up
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
