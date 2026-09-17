"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Project, Certificate } from "@/lib/types";

type Props = {
  projects: Project[];
  certificates: Certificate[];
};

const inputCls =
  "w-full rounded-lg border-[1.5px] border-ink bg-paper px-3 py-2 text-sm outline-none transition-shadow focus:shadow-[3px_3px_0_0_var(--ink)]";

const labelCls =
  "mb-1.5 block font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft";

type Tab = "project" | "certificate";

export default function AdminClient({ projects, certificates }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("project");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  function handleAuthError() {
    setError("Sesi habis — mengalihkan ke halaman login…");
    setTimeout(() => router.push("/login"), 1200);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    form.set("kind", tab);

    setBusy(true);
    setError(null);
    setStatus(null);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      if (res.status === 401) {
        handleAuthError();
        return;
      }
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Gagal menyimpan.");

      setStatus(
        tab === "project"
          ? "Project tersimpan dan sudah tampil di beranda ✓"
          : "Sertifikat tersimpan dan sudah tampil di arsip ✓",
      );
      formEl.reset();
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(kind: "project" | "certificate", key: string) {
    if (!window.confirm("Hapus item ini secara permanen?")) return;
    setBusy(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch(
        `/api/admin/upload?kind=${kind}&key=${encodeURIComponent(key)}`,
        { method: "DELETE" },
      );
      if (res.status === 401) {
        handleAuthError();
        return;
      }
      const json = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(json.error || "Gagal menghapus.");
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  const disabled = busy || isPending;

  return (
    <div className="space-y-10">
      {/* Pemilih tab */}
      <div className="flex w-fit rounded-full border-[1.5px] border-ink bg-raised p-1 shadow-[2px_2px_0_0_var(--ink)]">
        {(["project", "certificate"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] transition-all duration-200 ${
              tab === t
                ? "bg-gradient-to-r from-orange-600 to-pink-500 text-white shadow-[1px_1px_0_0_var(--ink)]"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {t === "project" ? "＋ Project" : "＋ Sertifikat"}
          </button>
        ))}
      </div>

      {/* Form upload */}
      <form onSubmit={submit} className="rounded-2xl border-[1.5px] border-ink bg-raised p-5 shadow-[4px_4px_0_0_var(--ink)] sm:p-7">
        <h2 className="font-display text-xl font-bold tracking-tight">
          {tab === "project" ? "Project baru" : "Sertifikat baru"}
        </h2>

        {tab === "project" ? (
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="title" className={labelCls}>
                Judul project *
              </label>
              <input
                id="title"
                name="title"
                required
                maxLength={80}
                className={inputCls}
                placeholder="mis. Sistem Kasir Kopi"
              />
            </div>
            <div>
              <label htmlFor="description" className={labelCls}>
                Deskripsi *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                maxLength={600}
                className={inputCls}
                placeholder="Apa yang dibuat, masalah apa yang diselesaikan…"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tags" className={labelCls}>
                  Tag (pisahkan koma)
                </label>
                <input
                  id="tags"
                  name="tags"
                  className={inputCls}
                  placeholder="next.js, tailwind, postgres"
                />
              </div>
              <div>
                <label htmlFor="screenshot" className={labelCls}>
                  Screenshot
                </label>
                <input
                  id="screenshot"
                  name="screenshot"
                  type="file"
                  accept="image/*"
                  className={`${inputCls} file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-2.5 file:py-1.5 file:font-mono file:text-[11px] file:uppercase file:text-paper`}
                />
              </div>
              <div>
                <label htmlFor="demoUrl" className={labelCls}>
                  URL demo live
                </label>
                <input
                  id="demoUrl"
                  name="demoUrl"
                  type="url"
                  className={inputCls}
                  placeholder="https://demo.example.com"
                />
              </div>
              <div>
                <label htmlFor="repoUrl" className={labelCls}>
                  URL repo
                </label>
                <input
                  id="repoUrl"
                  name="repoUrl"
                  type="url"
                  className={inputCls}
                  placeholder="https://github.com/…"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="cert-title" className={labelCls}>
                  Judul sertifikat *
                </label>
                <input
                  id="cert-title"
                  name="title"
                  required
                  maxLength={120}
                  className={inputCls}
                  placeholder="mis. Cloud Computing Fundamentals"
                />
              </div>
              <div>
                <label htmlFor="cert-issuer" className={labelCls}>
                  Penerbit *
                </label>
                <input
                  id="cert-issuer"
                  name="issuer"
                  required
                  maxLength={80}
                  className={inputCls}
                  placeholder="mis. Dicoding / Coursera"
                />
              </div>
              <div>
                <label htmlFor="cert-issuedAt" className={labelCls}>
                  Tanggal terbit
                </label>
                <input
                  id="cert-issuedAt"
                  name="issuedAt"
                  type="date"
                  className={inputCls}
                />
              </div>
              <div>
                <label htmlFor="cert-url" className={labelCls}>
                  URL verifikasi (opsional)
                </label>
                <input
                  id="cert-url"
                  name="url"
                  type="url"
                  className={inputCls}
                  placeholder="https://linkedin.com/…"
                />
              </div>
            </div>
            <div>
              <label htmlFor="cert-file" className={labelCls}>
                File sertifikat (PDF/gambar)
              </label>
              <input
                id="cert-file"
                name="file"
                type="file"
                accept="image/*,application/pdf"
                className={`${inputCls} file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-2.5 file:py-1.5 file:font-mono file:text-[11px] file:uppercase file:text-paper`}
              />
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-line pt-5">
          <button
            type="submit"
            disabled={disabled}
            className="rounded-lg border-[1.5px] border-ink bg-accent px-6 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-paper-raised shadow-[3px_3px_0_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--ink)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? "Menyimpan…" : `Simpan ${tab}`}
          </button>
          {status && (
            <p className="rounded-lg border-[1.5px] border-emerald-700 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800">
              {status}
            </p>
          )}
          {error && (
            <p
              role="alert"
              className="rounded-lg border-[1.5px] border-red-700 bg-red-50 px-3 py-1.5 text-sm text-red-700"
            >
              {error}
            </p>
          )}
        </div>
      </form>

      {/* Daftar project */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Project terunggah
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft">
            {projects.length} item
          </p>
        </div>
        {projects.length === 0 ? (
          <p className="rounded-xl border-[1.5px] border-dashed border-line bg-raised p-6 text-center text-sm text-ink-soft">
            Belum ada project — isi form di atas untuk mengunggah yang pertama.
          </p>
        ) : (
          <ul className="grid gap-3">
            {projects.map((p) => (
              <li
                key={p.slug}
                className="flex items-center gap-4 rounded-xl border-[1.5px] border-ink bg-raised p-3 shadow-[2px_2px_0_0_var(--ink)] transition-shadow hover:shadow-[4px_4px_0_0_var(--ink)]"
              >
                {/* Thumbnail */}
                <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg border border-line bg-paper">
                  {p.screenshotPath ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.screenshotPath}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center font-mono text-[10px] text-ink-soft">
                      tanpa foto
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{p.title}</p>
                  <p className="truncate font-mono text-[11px] text-ink-soft">
                    /projects/{p.slug}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.1em]">
                  {p.demoUrl && (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-accent">
                      demo
                    </span>
                  )}
                  {p.repoUrl && (
                    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-900">
                      repo
                    </span>
                  )}
                  <Link
                    href={`/projects/${p.slug}`}
                    className="underline underline-offset-4 hover:text-accent"
                  >
                    Lihat
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove("project", p.slug)}
                    disabled={disabled}
                    className="text-red-700 underline underline-offset-4 hover:no-underline disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Daftar sertifikat */}
      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl font-bold tracking-tight">
            Sertifikat terunggah
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-soft">
            {certificates.length} item
          </p>
        </div>
        {certificates.length === 0 ? (
          <p className="rounded-xl border-[1.5px] border-dashed border-line bg-raised p-6 text-center text-sm text-ink-soft">
            Belum ada sertifikat — unggah lewat tab “＋ Sertifikat”.
          </p>
        ) : (
          <ul className="grid gap-3">
            {certificates.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-4 rounded-xl border-[1.5px] border-ink bg-raised p-3 shadow-[2px_2px_0_0_var(--ink)] transition-shadow hover:shadow-[4px_4px_0_0_var(--ink)]"
              >
                <span
                  aria-hidden
                  className="grid h-14 w-20 shrink-0 place-items-center rounded-lg border border-line bg-gradient-to-br from-amber-100 to-orange-100 font-mono text-lg"
                >
                  🏅
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{c.title}</p>
                  <p className="truncate font-mono text-[11px] text-ink-soft">
                    {c.issuer} · {c.issuedAt}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.1em]">
                  {c.filePath && (
                    <a
                      href={c.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-accent"
                    >
                      File
                    </a>
                  )}
                  {c.url && (
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-accent"
                    >
                      Verifikasi
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => remove("certificate", c.id)}
                    disabled={disabled}
                    className="text-red-700 underline underline-offset-4 hover:no-underline disabled:opacity-50"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="rounded-xl border border-line bg-raised px-4 py-3 font-mono text-[11px] leading-relaxed text-ink-soft">
        Format yang diterima: JPG · PNG · WebP · AVIF · GIF · PDF, maksimal 8
        MB per file. Sesi login berlaku 7 hari.
      </p>
    </div>
  );
}
