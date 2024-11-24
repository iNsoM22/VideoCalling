import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'WebMAve',
  description: 'A solution to web meetings.',
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <div className="flex flex-col items-end min-h-screen h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Main Content */}
        {children}

        {/* Footer */}
        <footer className="w-full text-center text-sm text-gray-400 py-2">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} WebMAve. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
};

export default RootLayout;
