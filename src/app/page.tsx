import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  // Trivial change to force new Vercel deployment
  return (
    <div className="min-h-screen bg-background flex flex-col items-center pt-20">
      <Image
        src="/green.png"
        alt="Badjr Logo"
        width={200}
        height={200}
        className="mb-4" // Reduce margin below the logo
      />
      <div className="max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          USER PORTAL
        </h1>
        <p className="text-lg text-foreground mb-4">
          Your one-stop destination for amazing things.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/login" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-primary transition-colors">
            Login
          </Link>
          <Link href="/create-account" className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-primary transition-colors">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
