import Reveal from "./reveal";
import type { Certificate } from "@/lib/types";

const DOTS = [
  "bg-orange-500",
  "bg-pink-500",
  "bg-violet-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function CertificateRack({
  certificates,
}: {
  certificates: Certificate[];
}) {
  return (
    <section id="arsip" className="relative border-b-[1.5px] border-ink bg-raised">
      {/* aurora tipis di belakang section */}
      <div
        className="aurora aurora-ungu -right-20 top-6 h-56 w-56 opacity-30"
        aria-hidden
      />
      <div className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
                02 — Kredensial
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                Arsip <span className="gradient-text">sertifikat</span>
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              ({String(certificates.length).padStart(2, "0")})
            </p>
          </div>
        </Reveal>

        {certificates.length === 0 ? (
          <Reveal>
            <p className="stamp-sm rounded-xl bg-paper p-5 text-sm text-ink-soft">
              Belum ada sertifikat. Unggah lewat{" "}
              <a href="/admin" className="underline underline-offset-4">
                panel admin
              </a>
              .
            </p>
          </Reveal>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {certificates.map((c, i) => (
              <Reveal key={c.id} delay={(i % 2) * 90}>
                <li className="group stamp-sm h-full rounded-xl bg-paper p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--ink)] sm:p-5">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                        DOTS[i % DOTS.length]
                      }`}
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="font-display text-lg font-bold leading-snug">
                        {c.title}
                      </p>
                      <p className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-ink-soft">
                        {c.issuer} · {formatDate(c.issuedAt)}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                        {c.url && (
                          <a
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-underline text-accent"
                          >
                            Verifikasi ↗
                          </a>
                        )}
                        {c.filePath && (
                          <a
                            href={c.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-underline text-ink hover:text-accent"
                          >
                            Buka file ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
