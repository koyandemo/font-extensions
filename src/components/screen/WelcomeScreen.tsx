import React from "react";

const AUTH_URL = "https://mmfontshub.app/signin";

const WelcomeScreen: React.FC = () => {
  const openAuthPage = () => {
    if (chrome?.tabs) {
      chrome.tabs.create({ url: AUTH_URL }, () => {
        window.close(); // Close extension popup after opening tab
      });
    }
  };

  return (
    <div className="relative flex flex-col gap-10 items-center justify-between h-full w-full border-none! bg-white pb-12">
      {/* Yellow Gradient Background Section */}
      <div className="absolute top-0 left-0 right-0 w-full h-1/2 bg-linear-to-b from-[#FDE68A] to-white z-0" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center pt-20 px-6  text-center w-full">
        {/* Stylized 'M' Logo */}
        <div className="mb-10">
         <img alt="logo" width={53.61} height={49} src="/logo.png" />
        </div>

        {/* Text Section */}
        <p className="text-[20px] font-bold text-[#0F172A] mb-3 tracking-tight">
          Welcome to Myanmar Font Hub
        </p>
        <p className="text-[#515684] text-[12px] leading-relaxed max-w-[240px]">
          Log in to your account or create a new one to get started.
        </p>
      </div>

      {/* Buttons Section */}
      <div className="relative z-10 flex gap-4 px-6 w-full">
        <button
          onClick={openAuthPage}
          className="flex-1 bg-[#DDA82A]! rounded-full text-white py-3.5 px-4  font-semibold text-base active:scale-95 transition-transform shadow-md"
        >
          Sign Up
        </button>
        <button
          onClick={openAuthPage}
          className="flex-1 bg-[#0F172A]! text-white py-3.5 px-4 rounded-full font-semibold text-base active:scale-95 transition-transform shadow-md"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
