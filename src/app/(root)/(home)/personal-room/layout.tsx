import React, { ReactNode, Suspense } from 'react';
import Loader from '@/components/Loader';

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <main>
      <Suspense fallback={<Loader />}>{children}</Suspense>
    </main>
  );
};

export default RootLayout;
