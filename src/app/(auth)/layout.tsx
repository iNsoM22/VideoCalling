import { ReactNode } from 'react';
import Landing from './landing';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main className="overflow-hidden">
      <div className="relative flex h-screen w-screen flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Landing Page Section */}
        <Landing />

        {/* Main Content Section */}
        <div
          className={`main-content-bottom-up md:main-content absolute flex w-full justify-center pt-12 md:justify-end md:pt-0`}
        >
          <div className="overflow-hidden sm:w-3/5 lg:w-1/3">{children}</div>
        </div>
      </div>
    </main>
  );
};

export default RootLayout;
