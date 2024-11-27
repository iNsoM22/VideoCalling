import React from 'react';

const Landing = () => {
  return (
    <section className="relative h-screen w-full bg-gradient-to-b from-blue-500 to-purple-700 flex items-center justify-center overflow-hidden landing-animation">
      {/* 3D Background */}
      <div
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center opacity-80"
        style={{ backgroundImage: 'url("/images/bg.jpg")' }}
      ></div>

      {/* Main Content Container */}
      <div className="relative z-20 text-white text-center px-8 sm:px-16 py-12 sm:py-24 main-content">
        {/* Header */}
        <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight mb-6 animate-fadeIn-1 opacity-90">
          WebMAve
        </h1>

        {/* Subheading */}
        <p className="text-lg z-0 sm:text-2xl font-medium mb-8 animate-fadeIn-2 opacity-90">
          A seamless video calling experience for your team,
        </p>
        <p className="text-lg z-0 sm:text-2xl font-medium animate-fadeIn-3 opacity-90">
          friends, and family
        </p>
      </div>

      {/* 3D Floating Circle Animation */}
      <div className="absolute z-10 w-60 h-60 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 opacity-30 animate-floating"></div>

      {/* Extra Decorative Floating Circle */}
      <div className="absolute z-10 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-30 animate-floating"></div>

      {/* More Decorative Floating Circles */}
      <div className="absolute z-10 w-40 h-40 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 opacity-30 animate-floating"></div>
      <div className="absolute z-10 w-72 h-72 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 opacity-30 animate-floating"></div>
    </section>
  );
};

export default Landing;
