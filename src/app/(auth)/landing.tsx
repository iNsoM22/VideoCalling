import React from 'react';

const Landing = () => {
  return (
    <section className="landing-animation relative flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-500 to-purple-700 md:items-start">
      {/* 3D Background */}
      <div
        className="absolute inset-0 z-0 w-full bg-cover bg-fixed bg-center opacity-90"
        style={{ backgroundImage: 'url("/images/bg.jpg")' }}
      ></div>

      {/* Main Content Container */}
      <div className="main-content relative z-20 flex-col items-center px-8 py-12 text-center text-white sm:left-10 sm:px-16 sm:py-24">
        {/* Header */}
        <h1 className="animate-fadeIn-1 mb-10 text-6xl font-extrabold leading-tight opacity-90 sm:text-7xl">
          WebMAve
        </h1>

        {/* Refined Slogan */}
        <p className="animate-fadeIn-2 z-0 mb-4 text-xl font-semibold opacity-90 sm:text-3xl sm:leading-snug">
          Experience Seamless, High-Quality Video Calls like never before
        </p>
        <p className="animate-fadeIn-3 z-0 mb-8 text-lg font-medium opacity-90 sm:text-2xl">
          Connect with your team, friends, and family in an instant.
        </p>
      </div>

      {/* 3D Floating Circle Animation */}
      <div className="absolute z-10 size-40 animate-floating self-center rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 opacity-30 md:-mt-16"></div>

      {/* Extra Decorative Floating Circle */}
      <div className="absolute z-10 size-60 animate-floating self-center rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-30 md:-mt-12"></div>

      {/* More Decorative Floating Circles */}
      <div className="absolute z-10 size-32 animate-floating self-center rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 opacity-30 md:-mt-10"></div>
      <div className="absolute z-10 size-72 animate-floating self-center rounded-full bg-gradient-to-br from-green-500 to-yellow-500 opacity-30 md:-mt-8"></div>
    </section>
  );
};

export default Landing;
