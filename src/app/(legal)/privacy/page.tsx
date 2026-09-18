import type { Metadata } from "next";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What AGENCY collects, why, and who touches it.",
};

const heading = "mt-10 font-display text-xl font-semibold text-clay-800";
const body = "mt-3 leading-relaxed text-clay-700";

export default function PrivacyPage() {
  return (
    <article>
      <h1 className="font-display text-3xl font-semibold text-clay-800">Privacy Policy</h1>
      <p className="mt-2 text-sm text-clay-500">Last updated September 17, 2026</p>

      <p className={body}>
        AGENCY is run by DakJen Creative LLC. This page says what we collect,
        why, and who else touches it — in plain language, because you run a
        business too.
      </p>

      <h2 className={heading}>What we collect</h2>
      <p className={body}>
        <strong>Your account:</strong> name, email, phone, and the password you
        set (stored only as a cryptographic hash — we cannot read it).
        Optionally your address and a profile photo.
      </p>
      <p className={body}>
        <strong>Your business:</strong> what you enter to run it — business and
        DBA details, clients, services, invoices, transactions, budgets,
        contractors, and files you upload.
      </p>
      <p className={body}>
        <strong>Payments:</strong> when you connect payments, Stripe collects
        the identity and banking details required by law. We never see your
        bank credentials, and AGENCY never holds your funds. We do see your
        payment activity on the platform — amounts, dates, clients — which is
        what makes your books and our advice work.
      </p>

      <h2 className={heading}>Analytics & cookies</h2>
      <p className={body}>
        We use Vercel Analytics, which is cookieless and anonymous — it counts
        visits without identifying or tracking you across sites. The only
        cookie we set is the session cookie that keeps you signed in. There are
        no advertising or tracking cookies, which is why there is no cookie
        banner.
      </p>

      <h2 className={heading}>Who else touches your data</h2>
      <p className={body}>
        Our processors, and only to run the product: Neon (database hosting),
        Vercel (application hosting and analytics), Stripe (payments and
        identity verification), and Brevo (transactional email such as password
        resets and invoices you send). We do not sell your data, and we do not
        share it with anyone else.
      </p>

      <h2 className={heading}>What we can see</h2>
      <p className={body}>
        Because AGENCY is also an advisory service, our team can see your
        platform activity, including revenue collected through it. That
        visibility is what makes the advice real. We treat it as confidential
        and use it only to serve you.
      </p>

      <h2 className={heading}>Email</h2>
      <p className={body}>
        Account emails (password resets, receipts, invoices you send) are part
        of the service. Anything beyond that — announcements, tips — carries a
        working unsubscribe link, and unsubscribing actually stops the mail.
      </p>

      <h2 className={heading}>Your choices</h2>
      <p className={body}>
        You can update your details in the portal, opt out of non-essential
        messages in Settings, or ask us to export or delete your account by
        emailing us. Deleting your account removes your personal data; invoice
        and transaction records may be retained where tax law requires it.
      </p>

      <h2 className={heading}>Contact</h2>
      <p className={body}>
        DakJen Creative LLC — <a className="text-sage-700 underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
    </article>
  );
}
