import Link from "next/link";

export default function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-paper/85 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-orange-600 via-pink-500 to-violet-500 font-display text-sm font-bold text-white shadow-[2px_2px_0_0_var(--ink)] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
            F
          </span>
          <span className="font-display text-lg font-bold leading-none tracking-tight">
            Fortofolio
          </span>
        </Link>
        <ul className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.15em] sm:gap-6 sm:text-xs">
          <li>
            <Link href="/#kerja" className="link-underline hover:text-accent">
              Kerja
            </Link>
          </li>
          <li>
            <Link href="/#arsip" className="link-underline hover:text-accent">
              Sertifikat
            </Link>
          </li>
          <li>
            <Link href="/#kontak" className="link-underline hover:text-accent">
              Kontak
            </Link>
          </li>
          <li>
            <Link
              href="/admin"
              className="rounded-full border-[1.5px] border-ink bg-raised px-3 py-1.5 shadow-[2px_2px_0_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-paper hover:shadow-none"
            >
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
