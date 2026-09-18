import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-clay-50 px-6 text-center">
      <Image src="/agency-logo.svg" alt="" width={64} height={64} priority />
      <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-sage-700">
        404
      </p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-clay-800">
        This page doesn&apos;t exist.
      </h1>
      <p className="mt-3 max-w-md text-clay-600">
        The link may be old, or the page may have moved. Your account and your
        data are fine.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-700"
        >
          Go to your dashboard
        </Link>
        <Link
          href="/"
          className="rounded-control border border-clay-200 bg-white px-5 py-2.5 text-sm font-semibold text-clay-700 transition hover:border-sage-300"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
