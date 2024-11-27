import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

export default function Custom404() {
  return (
    <div className="error-page">
      {/* Image Section */}
      <div className="image-container">
        <Image
          src="/images/404.svg"
          alt="404 - Not Found"
          width={500}
          height={500}
        />
      </div>

      {/* Text Section */}
      <h1 className="error-title">Oops! Page Not Found</h1>
      <p className="error-message">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Navigation Buttons */}
      <div className="button-group">
        <Link href="/" className="error-button">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
