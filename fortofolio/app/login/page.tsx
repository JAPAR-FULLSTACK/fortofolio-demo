import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Masuk",
  robots: { index: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-5 py-12">
      {/* aurora latar */}
      <div className="aurora aurora-bata -left-24 top-0 h-80 w-80" aria-hidden />
      <div
        className="aurora aurora-pink -right-16 bottom-0 h-72 w-72"
        aria-hidden
      />
      <div
        className="aurora aurora-ungu left-1/3 -bottom-24 h-72 w-72"
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        <div className="animate-pop stamp rounded-2xl bg-raised p-7 sm:p-9">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-orange-600 via-pink-500 to-violet-500 font-display text-lg font-bold text-white shadow-[2px_2px_0_0_var(--ink)]">
              F
            </span>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-soft">
                Panel Kelola
              </p>
              <h1 className="font-display text-2xl font-bold tracking-tight">
                Masuk ke Fortofolio
              </h1>
            </div>
          </div>

          <LoginForm />

          <p className="mt-6 border-t border-line pt-4 text-center font-mono text-[11px] leading-relaxed text-ink-soft">
            Kredensial default: <b>admin / admin</b> — ganti lewat env{" "}
            <code className="text-accent-deep">AUTH_USERNAME</code> &{" "}
            <code className="text-accent-deep">AUTH_PASSWORD</code>.
          </p>
        </div>

        <p className="mt-5 text-center font-mono text-xs uppercase tracking-[0.15em]">
          <Link
            href="/"
            className="link-underline text-ink-soft hover:text-accent"
          >
            ← Kembali ke beranda
          </Link>
        </p>
      </div>
    </main>
  );
}
