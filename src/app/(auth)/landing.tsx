import React from 'react';

const Landing = () => {
  return (
    <section className="landing-animation relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-blue-500 to-purple-700">
      {/* 3D Background */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-fixed bg-center opacity-80"
        style={{ backgroundImage: 'url("/images/bg.jpg")' }}
      ></div>

      {/* Main Content Container */}
      <div className="main-content relative z-20 px-8 py-12 text-center text-white sm:px-16 sm:py-24">
        {/* Header */}
        <h1 className="animate-fadeIn-1 mb-6 text-5xl font-extrabold leading-tight opacity-90 sm:text-7xl">
          WebMAve
        </h1>

        {/* Subheading */}
        <p className="animate-fadeIn-2 z-0 mb-8 text-lg font-medium opacity-90 sm:text-2xl">
          A seamless video calling experience for your team,
        </p>
        <p className="animate-fadeIn-3 z-0 text-lg font-medium opacity-90 sm:text-2xl">
          friends, and family
        </p>
      </div>

      {/* 3D Floating Circle Animation */}
      <div className="absolute z-10 size-60 animate-floating rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 opacity-30"></div>

      {/* Extra Decorative Floating Circle */}
      <div className="absolute z-10 size-80 animate-floating rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-30"></div>

      {/* More Decorative Floating Circles */}
      <div className="absolute z-10 size-40 animate-floating rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 opacity-30"></div>
      <div className="absolute z-10 size-72 animate-floating rounded-full bg-gradient-to-br from-green-500 to-yellow-500 opacity-30"></div>
    </section>
  );
};

export default Landing;
