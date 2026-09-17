export default function SiteFooter() {
  return (
    <footer id="kontak" className="relative overflow-hidden bg-ink text-paper">
      {/* aurora gelap */}
      <div
        className="aurora aurora-bata -left-20 bottom-0 h-64 w-64 opacity-40"
        aria-hidden
      />
      <div
        className="aurora aurora-ungu right-0 top-0 h-72 w-72 opacity-40"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 py-16 sm:px-8 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-paper/60">
          03 — Kontak
        </p>
        <a
          href="mailto:halo@example.com"
          className="mt-4 inline-block font-display text-4xl font-bold tracking-tight transition-all duration-300 hover:translate-x-2 sm:text-6xl"
        >
          <span className="gradient-text">halo@example.com</span>
        </a>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">
          Punya ide project, lowongan, atau sekadar mau ngobrol soal teknologi?
          Kirim surel — saya balas secepat mungkin.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/60">
          <p>© {new Date().getFullYear()} — Dibuat sendiri, tanpa template.</p>
          <div className="flex gap-5">
            <a
              href="https://github.com/username"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-200 hover:-translate-y-0.5 hover:text-paper"
            >
              GitHub ↗
            </a>
            <a
              href="https://linkedin.com/in/username"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-200 hover:-translate-y-0.5 hover:text-paper"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
