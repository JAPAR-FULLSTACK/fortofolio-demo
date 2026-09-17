import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { readPortfolio, getUploadStats } from "@/lib/store";
import { getSessionUser } from "@/lib/auth";
import StatCard from "@/components/stat-card";
import { logout } from "./actions";
import AdminClient from "./admin-client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false },
};

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const { projects, certificates } = await readPortfolio();
  const stats = await getUploadStats();

  const latest = [
    ...projects.map((p) => ({ at: p.createdAt, label: p.title, kind: "Project" })),
    ...certificates.map((c) => ({ at: c.createdAt, label: c.title, kind: "Sertifikat" })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .at(0);

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-12 sm:px-8">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
            Panel Kelola
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Upload <span className="gradient-text">Project &amp; Sertifikat</span>
          </h1>
          <p className="mt-2 font-mono text-xs text-ink-soft">
            Masuk sebagai <b className="text-accent-deep">{user}</b>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="link-underline font-mono text-xs uppercase tracking-[0.15em] text-ink-soft hover:text-accent"
          >
            ← Lihat situs
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="rounded-full border-[1.5px] border-ink bg-raised px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.15em] shadow-[2px_2px_0_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:text-white hover:shadow-none"
            >
              Keluar
            </button>
          </form>
        </div>
      </header>

      {/* Kartu statistik */}
      <div className="mb-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Project"
          value={String(projects.length).padStart(2, "0")}
          hint="tampil di beranda"
          tone="orange"
          icon="◆"
        />
        <StatCard
          label="Sertifikat"
          value={String(certificates.length).padStart(2, "0")}
          hint="di arsip kredensial"
          tone="pink"
          icon="🏅"
        />
        <StatCard
          label="File tersimpan"
          value={String(stats.files)}
          hint={formatBytes(stats.bytes)}
          tone="violet"
          icon="🗂"
        />
        <StatCard
          label="Terakhir diunggah"
          value={latest ? latest.kind : "—"}
          hint={latest ? latest.label : "belum ada aktivitas"}
          tone="sky"
          icon="⏱"
        />
      </div>

      <AdminClient projects={projects} certificates={certificates} />
    </main>
  );
}
