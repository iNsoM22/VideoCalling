import CallerList from '@/components/Callers';
import React from 'react';

const PreviousPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Previous Calls</h1>

      <CallerList type="ended" />
    </section>
  );
};

export default PreviousPage;
