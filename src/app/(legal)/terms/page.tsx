import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms for using AGENCY.",
};

const heading = "mt-10 font-display text-xl font-semibold text-clay-800";
const body = "mt-3 leading-relaxed text-clay-700";

export default function TermsPage() {
  return (
    <article>
      <h1 className="font-display text-3xl font-semibold text-clay-800">Terms of Service</h1>
      <p className="mt-2 text-sm text-clay-500">Last updated September 17, 2026</p>

      <p className={body}>
        These terms cover your use of AGENCY, a platform operated by DakJen
        Creative LLC. Creating an account means you agree to them.
      </p>

      <h2 className={heading}>The service</h2>
      <p className={body}>
        AGENCY provides business tools — invoicing, payments, bookkeeping,
        budgeting, contracts, classes — plus advisory access. New accounts get
        seven days of full access; after that, continued use requires completing
        onboarding, including connecting payments.
      </p>

      <h2 className={heading}>Fees</h2>
      <p className={body}>
        There is no monthly fee. AGENCY charges a percentage of payments you
        collect through the platform, taken automatically at the time of each
        payment. The current rate schedule is shown before you connect
        payments and inside the platform. Rates decrease as your trailing
        revenue grows. Card payments carry a surcharge over bank transfer,
        and are off unless you enable them.
      </p>

      <h2 className={heading}>Payments</h2>
      <p className={body}>
        Payments are processed by Stripe through your own connected Stripe
        account. You are the merchant of record for your clients; AGENCY never
        holds your funds. Stripe&apos;s own terms apply to your connected
        account.
      </p>

      <h2 className={heading}>Your data, our visibility</h2>
      <p className={body}>
        You own your business data. Because AGENCY includes advisory services,
        our team can see your platform activity, including revenue. See the{" "}
        <a href="/privacy" className="text-sage-700 underline underline-offset-4">Privacy Policy</a>{" "}
        for the full picture.
      </p>

      <h2 className={heading}>Acceptable use</h2>
      <p className={body}>
        Don&apos;t use AGENCY for anything unlawful, don&apos;t invoice for
        goods or services that don&apos;t exist, and don&apos;t attempt to
        access other members&apos; data. We can suspend accounts that put other
        members, their clients, or the platform at risk.
      </p>

      <h2 className={heading}>Not professional advice</h2>
      <p className={body}>
        AGENCY&apos;s tools and guidance support your decisions; they are not
        legal, tax, or accounting advice. Confirm tax and legal questions with
        a licensed professional.
      </p>

      <h2 className={heading}>Liability</h2>
      <p className={body}>
        The service is provided as-is. To the maximum extent permitted by law,
        DakJen Creative LLC&apos;s liability for any claim related to the
        service is limited to the fees you paid to AGENCY in the twelve months
        before the claim.
      </p>

      <h2 className={heading}>Changes & contact</h2>
      <p className={body}>
        We may update these terms; material changes will be announced in the
        platform. Questions:{" "}
        <a className="text-sage-700 underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </article>
  );
}
