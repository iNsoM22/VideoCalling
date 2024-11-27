import CallerList from '@/components/Callers';

const UpcomingPage = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">Upcoming Meeting</h1>

      <CallerList type="upcoming" />
    </section>
  );
};

export default UpcomingPage;
