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
      <div className="relative flex h-screen w-screen flex-col justify-end bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Landing Page Section */}
        <Landing />

        {/* Main Content Section */}
        <div className="main-content absolute flex w-full justify-end">
          {' '}
          {/* Change justify-end to justify-start */}
          <div className="ml-10 w-full sm:w-3/5 lg:w-1/3">
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
