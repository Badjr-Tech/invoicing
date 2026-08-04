import Link from "next/link";
import {
  AppWindow,
  AtSign,
  BadgePlus,
  BookMarked,
  Brush,
  CalendarCheck2,
  CalendarClock,
  Combine,
  CopyPlus,
  HandCoins,
  LaptopMinimal,
  MailCheck,
} from "lucide-react";

/**
 * Product catalog.
 *
 * Cards, not colored blocks: white surface, tinted icon chip, hover raises
 * the border. The old page was a wall of 160px blue/green/red squares.
 *
 * "Coming soon" entries are the unnamed placeholders (Product 1.4, 1.5,
 * 3.4). They stay visible so the catalog does not silently shrink, but they
 * do not link anywhere until they are real.
 */

type CatalogItem = {
  title: string;
  href?: string;
  icon: typeof AppWindow;
  blurb: string;
  comingSoon?: boolean;
};

type CatalogSection = {
  heading: string;
  sub: string;
  items: CatalogItem[];
};

const CATALOG: CatalogSection[] = [
  {
    heading: "Business branding",
    sub: "Look the part everywhere a client meets you.",
    items: [
      {
        title: "Website",
        href: "/dashboard/products/website",
        icon: AppWindow,
        blurb: "A site built for you by the studio.",
      },
      {
        title: "Email",
        href: "/dashboard/products/email",
        icon: AtSign,
        blurb: "Send as your business, replies to your inbox.",
      },
      {
        title: "Bookkeeping",
        href: "/dashboard/financial-tools/bookkeeping",
        icon: HandCoins,
        blurb: "Books that post themselves as you get paid.",
      },
      {
        title: "Professional Email",
        href: "/dashboard/products/professional-email",
        icon: MailCheck,
        blurb: "A real mailbox on your own domain.",
      },
      {
        title: "Portfolio",
        href: "/dashboard/products/portfolio",
        icon: Brush,
        blurb: "Show the work that wins the next client.",
      },
      { title: "Coming soon", icon: BadgePlus, blurb: "In the works.", comingSoon: true },
    ],
  },
  {
    heading: "Your expertise",
    sub: "Package what you know and sell it.",
    items: [
      {
        title: "Course",
        href: "/dashboard/courses/create",
        icon: LaptopMinimal,
        blurb: "Build and sell a course of your own.",
      },
      {
        title: "Library",
        href: "/dashboard/products/library",
        icon: BookMarked,
        blurb: "A home for your templates and guides.",
      },
      {
        title: "Book a call",
        href: "/dashboard/products/book-a-call",
        icon: CalendarCheck2,
        blurb: "Let clients book paid time with you.",
      },
      {
        title: "Custom",
        href: "/dashboard/products/custom",
        icon: BadgePlus,
        blurb: "Something else? Tell us what you need.",
      },
    ],
  },
  {
    heading: "Client offerings",
    sub: "Ways for clients to buy from you.",
    items: [
      {
        title: "Book Me",
        href: "/dashboard/products/book-me",
        icon: CalendarClock,
        blurb: "Your booking page, on your brand.",
      },
      {
        title: "Deliverables",
        href: "/dashboard/products/deliverables",
        icon: Combine,
        blurb: "Scoped work, packaged and priced.",
      },
      {
        title: "Campaign",
        href: "/dashboard/products/campaign",
        icon: CopyPlus,
        blurb: "A studio-run push for your next launch.",
      },
      { title: "Coming soon", icon: BadgePlus, blurb: "In the works.", comingSoon: true },
    ],
  },
];

function ProductCard({ item }: { item: CatalogItem }) {
  const Icon = item.icon;

  const inner = (
    <>
      <span
        className={`flex h-10 w-10 items-center justify-center rounded-control ${
          item.comingSoon ? "bg-clay-100 text-clay-400" : "bg-sage-100 text-sage-700"
        }`}
      >
        <Icon size={19} />
      </span>
      <div className="mt-3.5">
        <p
          className={`font-display text-[15px] font-semibold ${
            item.comingSoon ? "text-clay-400" : "text-clay-800"
          }`}
        >
          {item.title}
        </p>
        <p
          className={`mt-1 text-[13px] leading-snug ${
            item.comingSoon ? "text-clay-400" : "text-clay-600"
          }`}
        >
          {item.blurb}
        </p>
      </div>
    </>
  );

  if (item.comingSoon || !item.href) {
    return (
      <div className="rounded-card border border-dashed border-clay-200 bg-clay-50 p-5">
        {inner}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className="block rounded-card border border-clay-200 bg-white p-5 shadow-card transition hover:border-sage-300 hover:shadow-lift"
    >
      {inner}
    </Link>
  );
}

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-semibold text-clay-800">
        Products
      </h1>
      <p className="mt-1.5 text-clay-600">
        Add tools and services to your account as you need them.
      </p>

      <div className="mt-10 space-y-12">
        {CATALOG.map((section) => (
          <section key={section.heading}>
            <h2 className="font-display text-lg font-semibold text-clay-800">
              {section.heading}
            </h2>
            <p className="mt-0.5 text-sm text-clay-600">{section.sub}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <ProductCard key={item.title + (item.href ?? "")} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
