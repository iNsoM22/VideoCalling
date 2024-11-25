'use client';
import React from 'react';

const BackgroundAnimation = () => {
  return (
    <div className="relative w-full h-screen">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src="/videos/WebMAve.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundAnimation;
