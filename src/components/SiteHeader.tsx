import Link from "next/link";

const NAV = [
  { href: "/reports", label: "Daily Reports" },
  { href: "/monthly", label: "Monthly Reports" },
  { href: "/regions", label: "Regions" },
  { href: "/community", label: "Community" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-brand-600 text-sm font-bold text-white">
            E
          </span>
          <span className="text-lg font-semibold text-slate-900">ECCE Policy Watch</span>
        </Link>
        <nav className="hidden gap-6 sm:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-brand-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#subscribe"
          className="rounded-md bg-brand-600 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Subscribe
        </Link>
      </div>
    </header>
  );
}
