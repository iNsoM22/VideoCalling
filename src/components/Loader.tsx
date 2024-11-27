import Image from 'next/image';
import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-content">
        {/* Rotating Spinner */}
        <Image
          src="/icons/loading-circle.svg"
          alt="Loading..."
          width={80}
          height={80}
          className="spinner"
          priority // Add this attribute for better performance
        />

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div className="progress-bar"></div>
        </div>

        {/* Text */}
        <p className="loader-text">Loading content, please wait...</p>
      </div>
    </div>
  );
};

export default Loader;
