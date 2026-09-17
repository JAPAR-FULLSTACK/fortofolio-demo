const TONES: Record<string, { bar: string; icon: string }> = {
  orange: { bar: "from-orange-500 to-amber-400", icon: "bg-orange-100 text-orange-900" },
  pink: { bar: "from-pink-500 to-rose-400", icon: "bg-pink-100 text-pink-900" },
  violet: { bar: "from-violet-500 to-purple-400", icon: "bg-violet-100 text-violet-900" },
  sky: { bar: "from-sky-500 to-cyan-400", icon: "bg-sky-100 text-sky-900" },
};

export default function StatCard({
  label,
  value,
  hint,
  tone = "orange",
  icon = "◆",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: keyof typeof TONES;
  icon?: string;
}) {
  const t = TONES[tone] ?? TONES.orange;
  return (
    <div className="group relative overflow-hidden rounded-xl border-[1.5px] border-ink bg-raised p-4 shadow-[3px_3px_0_0_var(--ink)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0_0_var(--ink)] sm:p-5">
      <span
        aria-hidden
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${t.bar}`}
      />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            {label}
          </p>
          <p className="mt-1.5 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            {value}
          </p>
          {hint && (
            <p className="mt-1 font-mono text-[11px] text-ink-soft">{hint}</p>
          )}
        </div>
        <span
          aria-hidden
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base ${t.icon}`}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
