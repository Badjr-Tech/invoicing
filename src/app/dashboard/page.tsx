import Link from 'next/link';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  FileText,
  Receipt,
  Users,
} from 'lucide-react';
import { requireUser } from '@/lib/session';
import { loadBirdsEyeMetrics, formatCurrency } from '@/lib/dashboard-metrics';

/**
 * Home is the Bird's Eye View (spec §4.5): three numbers, large, above the
 * fold. Everything else on this page sits below them.
 */
export default async function DashboardPage() {
  const user = await requireUser();
  const metrics = await loadBirdsEyeMetrics(user.id);
  const firstName = user.name?.split(' ')[0] ?? 'there';

  const numbers = [
    {
      label: 'What you need to get paid',
      value: formatCurrency(metrics.owedToYou),
      detail:
        metrics.owedCount === 0
          ? 'Nothing outstanding'
          : `${metrics.owedCount} unpaid invoice${metrics.owedCount === 1 ? '' : 's'}`,
      flag:
        metrics.overdueCount > 0
          ? `${metrics.overdueCount} over 30 days`
          : null,
      href: '/dashboard/invoicing',
    },
    {
      label: 'What your expenses actually are',
      value: formatCurrency(metrics.recentExpenses),
      detail: 'Last 30 days',
      flag: null,
      href: '/dashboard/financial-tools/bookkeeping/reports',
    },
    {
      label: 'What is available for growth',
      value: formatCurrency(metrics.availableForGrowth),
      detail: `${formatCurrency(metrics.recentIncome)} in, ${formatCurrency(metrics.recentExpenses)} out`,
      flag: metrics.availableForGrowth < 0 ? 'Spending exceeds income' : null,
      href: '/dashboard/financial-tools/budget',
    },
  ];

  const shortcuts = [
    { label: 'Send an invoice', href: '/dashboard/invoicing', icon: FileText },
    { label: 'Record a transaction', href: '/dashboard/products/bookkeeping', icon: Receipt },
    { label: 'Your clients', href: '/dashboard/clients', icon: Users },
    { label: 'Classes & resources', href: '/dashboard/resources', icon: BookOpen },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-3xl font-semibold text-clay-800">
        Good to see you, {firstName}.
      </h1>
      <p className="mt-1.5 text-clay-600">
        {metrics.hasData
          ? 'Here is where your business stands today.'
          : 'Register your business to start seeing your numbers here.'}
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {numbers.map((number) => (
          <Link
            key={number.label}
            href={number.href}
            className="group rounded-card border border-clay-200 bg-white p-6 shadow-card transition hover:shadow-lift"
          >
            <p className="text-sm font-medium leading-snug text-clay-600">
              {number.label}
            </p>
            <p className="mt-3 font-display text-4xl font-semibold tracking-tight text-clay-800">
              {number.value}
            </p>
            <p className="mt-2 text-sm text-clay-500">{number.detail}</p>
            {number.flag && (
              <p className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-ember-50 px-2.5 py-1 text-xs font-semibold text-ember-700">
                <AlertCircle size={13} />
                {number.flag}
              </p>
            )}
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-sm font-semibold uppercase tracking-widest text-clay-500">
        Jump back in
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {shortcuts.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-card border border-clay-200 bg-white p-4 transition hover:border-sage-300 hover:bg-sage-50"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-sage-100 text-sage-600">
              <Icon size={17} />
            </span>
            <span className="text-sm font-medium text-clay-800">{label}</span>
          </Link>
        ))}
      </div>

      {!metrics.hasData && (
        <div className="mt-10 rounded-card border border-ember-200 bg-ember-50 p-6">
          <h2 className="font-display text-xl font-semibold text-clay-800">
            Set up your business
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-clay-700">
            Once your business is registered and payments are connected, your
            invoices and expenses feed these numbers automatically.
          </p>
          <Link
            href="/onboarding"
            className="mt-4 inline-flex items-center gap-1.5 rounded-control bg-ember-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-ember-500"
          >
            Continue setup <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
