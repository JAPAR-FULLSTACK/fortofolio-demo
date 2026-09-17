import Link from "next/link";
import Reveal from "./reveal";
import type { Project } from "@/lib/types";

/* Warna chip bergantian biar daftar terasa hidup, bukan abu-abu semua */
const TAG_STYLES = [
  "bg-orange-100 text-orange-900",
  "bg-pink-100 text-pink-900",
  "bg-violet-100 text-violet-900",
  "bg-sky-100 text-sky-900",
  "bg-emerald-100 text-emerald-900",
  "bg-amber-100 text-amber-900",
];

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <section id="kerja" className="border-b-[1.5px] border-ink">
      <div className="mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
                01 — Karya
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Project{" "}
                <span className="gradient-text">terpilih</span>
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              ({String(projects.length).padStart(2, "0")})
            </p>
          </div>
        </Reveal>

        {projects.length === 0 ? (
          <Reveal>
            <p className="stamp-sm rounded-xl bg-raised p-5 text-sm text-ink-soft">
              Belum ada project. Buka{" "}
              <Link href="/admin" className="underline underline-offset-4">
                panel admin
              </Link>{" "}
              untuk mengunggah yang pertama.
            </p>
          </Reveal>
        ) : (
          <ol className="grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 2) * 90}>
                <li>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group relative block h-full overflow-hidden rounded-xl border-[1.5px] border-ink bg-raised p-5 shadow-[4px_4px_0_0_var(--ink)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[7px_7px_0_0_var(--ink)] sm:p-6"
                  >
                    {/* Strip gradien di atas kartu, melorot saat hover */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 h-1.5 origin-left scale-x-0 bg-gradient-to-r from-orange-600 via-pink-500 to-violet-500 transition-transform duration-500 group-hover:scale-x-100"
                    />
                    {/* Nomor besar samar di pojok */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-5 font-display text-[5.5rem] font-bold leading-none text-ink/[0.05] transition-colors duration-300 group-hover:text-ink/[0.09]"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
                      <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-br from-orange-500 to-pink-500" />
                      {String(i + 1).padStart(2, "0")}
                      {p.demoUrl && (
                        <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[10px] text-paper-raised">
                          Demo ↗
                        </span>
                      )}
                    </span>

                    <span className="mt-4 block font-display text-2xl font-bold leading-tight tracking-tight group-hover:underline group-hover:decoration-accent group-hover:decoration-2 group-hover:underline-offset-4">
                      {p.title}
                    </span>
                    <span className="mt-2 line-clamp-3 block text-sm leading-relaxed text-ink-soft">
                      {p.description}
                    </span>

                    {p.tags.length > 0 && (
                      <span className="mt-4 flex flex-wrap gap-1.5">
                        {p.tags.slice(0, 4).map((tag, ti) => (
                          <span
                            key={tag}
                            className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
                              TAG_STYLES[(i + ti) % TAG_STYLES.length]
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                        {p.tags.length > 4 && (
                          <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-ink-soft">
                            +{p.tags.length - 4}
                          </span>
                        )}
                      </span>
                    )}

                    <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-accent transition-transform duration-300 group-hover:translate-x-1">
                      Lihat detail →
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
