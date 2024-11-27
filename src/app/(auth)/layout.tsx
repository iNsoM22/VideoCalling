import { Metadata } from 'next';
import { ReactNode } from 'react';
import Landing from './landing';

export const metadata: Metadata = {
  title: 'WebMAve',
  description: 'A solution to web meetings.',
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="overflow-hidden">
      {/* Hide scrollbars globally */}
      <div className="relative flex flex-col justify-end h-screen w-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Landing Page Section */}
        <Landing />

        {/* Main Content Section */}
        <div className="absolute flex justify-end w-full main-content">
          {' '}
          {/* Change justify-end to justify-start */}
          <div className="w-full sm:w-3/5 lg:w-1/3 ml-10">
            {' '}
            {/* Add left margin */}
            {children}
          </div>
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
