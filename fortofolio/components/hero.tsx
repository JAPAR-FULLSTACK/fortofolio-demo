type Props = {
  projectCount: number;
  certificateCount: number;
};

/* Anggota tim — tampil sebagai chip warna-warni di hero */
const TEAM = [
  { name: "Raffa", cls: "bg-orange-100 text-orange-900" },
  { name: "Jesika", cls: "bg-pink-100 text-pink-900" },
  { name: "Susan", cls: "bg-violet-100 text-violet-900" },
  { name: "Arya", cls: "bg-sky-100 text-sky-900" },
  { name: "Rasya", cls: "bg-emerald-100 text-emerald-900" },
];

const MARQUEE = [
  "Web App",
  "UI Design",
  "Mobile app",
  "App development",
  "Database",

];

export default function Hero({ projectCount, certificateCount }: Props) {
  return (
    <section className="relative overflow-hidden border-b-[1.5px] border-ink">
      {/* Blob aurora berwarna */}
      <div className="aurora aurora-bata -left-24 -top-24 h-80 w-80" aria-hidden />
      <div className="aurora aurora-pink right-0 top-10 h-72 w-72" aria-hidden />
      <div
        className="aurora aurora-ungu -bottom-28 left-1/3 h-80 w-80"
        aria-hidden
      />
      <div
        className="aurora aurora-langit right-1/4 -bottom-24 h-64 w-64"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-5xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <p className="animate-pop font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
          Tim 4G1B / {new Date().getFullYear()}
        </p>

        <h1 className="animate-pop d-1 mt-6 max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
          Kami membuat beragam project —{" "}
          <span className="gradient-text">
            dari mini project sampai  mega project.
          </span>
        </h1>

        <p className="animate-pop d-2 mt-6 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
          selamat datang di fortofolio kami di sini kami menampilkan semua project tim kami 
        </p>

        {/* Statistik */}
        <dl className="animate-pop d-3 mt-10 flex flex-wrap gap-x-10 gap-y-4 font-mono text-xs uppercase tracking-[0.15em]">
          <div>
            <dt className="text-ink-soft">Project</dt>
            <dd className="mt-1 font-display text-3xl font-bold tracking-tight">
              {String(projectCount).padStart(2, "0")}
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Sertifikat</dt>
            <dd className="mt-1 font-display text-3xl font-bold tracking-tight">
              {String(certificateCount).padStart(2, "0")}
            </dd>
          </div>
          <div>
            <dt className="text-ink-soft">Status</dt>
            <dd className="mt-1 flex items-center gap-2 font-display text-3xl font-bold tracking-tight">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
              </span>
              Terbuka
            </dd>
          </div>
        </dl>

        {/* Chip anggota tim */}
        <ul className="animate-pop d-4 mt-8 flex flex-wrap gap-2">
          {TEAM.map((member) => (
            <li
              key={member.name}
              className={`stamp-sm cursor-default rounded-full px-3.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] transition-transform duration-200 hover:-translate-y-0.5 ${member.cls}`}
            >
              {member.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Marquee keahlian tim */}
      <div className="marquee relative border-t-[1.5px] border-ink bg-ink py-2.5 text-paper">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              className="flex shrink-0 items-center font-mono text-xs uppercase tracking-[0.2em]"
              aria-hidden={copy === 1}
            >
              {MARQUEE.map((item) => (
                <li key={item} className="flex items-center">
                  <span className="px-5">{item}</span>
                  <span className="text-accent">✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
