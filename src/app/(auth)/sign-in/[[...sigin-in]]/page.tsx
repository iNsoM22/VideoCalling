import { SignIn } from '@clerk/nextjs';

export default function SiginInPage() {
  return (
    <main className="flex items-center justify-center md:h-screen">
      <SignIn />
    </main>
  );
}
