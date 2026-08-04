import Image from "next/image";
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-clay-50 px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Image
            src="/agency-logo.png"
            alt="AGENCY"
            width={72}
            height={72}
            className="mx-auto h-18 w-18 object-contain"
            priority
          />
          <h1 className="mt-6 font-display text-3xl font-semibold text-clay-800">
            Choose a new password
          </h1>
        </div>

        <div className="rounded-card border border-clay-200 bg-white p-8 shadow-card">
          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="text-center">
              <p className="text-clay-700">
                This link is missing its reset code. Request a new one and it
                will arrive within a minute.
              </p>
              <Link
                href="/forgot-password"
                className="mt-4 inline-block rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
              >
                Request a new link
              </Link>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-clay-600">
          <Link
            href="/login"
            className="font-semibold text-sage-600 underline underline-offset-4 hover:text-sage-700"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
