import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { readPortfolio } from "@/lib/store";
import SiteNav from "@/components/site-nav";
import SiteFooter from "@/components/site-footer";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await readPortfolio();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project tidak ditemukan" };
  return { title: project.title, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const { projects } = await readPortfolio();
  const project = projects.find((p) => p.slug === slug);

  if (!project) notFound();

  return (
    <>
      <SiteNav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12 sm:px-8 sm:py-16">
        <Link
          href="/#kerja"
          className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft underline decoration-line underline-offset-4 hover:decoration-accent"
        >
          ← Semua project
        </Link>

        <header className="mt-8">
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-ink-soft">
            {new Date(project.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl">
            {project.title}
          </h1>
          {project.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-[1.5px] border-ink px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.12em]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </header>

        <div className="mt-8 flex flex-wrap gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="stamp-sm bg-accent px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-paper-raised transition-transform hover:-translate-y-0.5"
            >
              Buka demo live ↗
            </a>
          )}
          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="stamp-sm bg-raised px-5 py-2.5 font-mono text-xs uppercase tracking-[0.15em] transition-transform hover:-translate-y-0.5"
            >
              Lihat kode ↗
            </a>
          )}
        </div>

        {project.screenshotPath && (
          <div className="stamp mt-10 overflow-hidden bg-raised p-2 sm:p-3">
            <Image
              src={project.screenshotPath}
              alt={`Screenshot ${project.title}`}
              width={1200}
              height={675}
              unoptimized
              className="h-auto w-full border border-line object-cover"
            />
          </div>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <section>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
              Tentang project ini
            </h2>
            <p className="mt-4 max-w-2xl whitespace-pre-line text-base leading-relaxed sm:text-lg">
              {project.description}
            </p>
          </section>

          {project.demoUrl && (
            <aside>
              <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-ink-soft">
                Preview
              </h2>
              <div className="stamp mt-4 overflow-hidden bg-raised">
                <div className="flex items-center gap-1.5 border-b-[1.5px] border-ink bg-paper px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full border border-ink bg-raised" />
                  <span className="h-2.5 w-2.5 rounded-full border border-ink bg-raised" />
                  <span className="truncate font-mono text-[10px] text-ink-soft">
                    {project.demoUrl}
                  </span>
                </div>
                <iframe
                  src={project.demoUrl}
                  title={`Preview ${project.title}`}
                  loading="lazy"
                  sandbox="allow-scripts allow-same-origin allow-forms"
                  className="h-72 w-full"
                />
              </div>
              <p className="mt-3 font-mono text-[10px] leading-relaxed text-ink-soft">
                Kalau preview kosong, situs demo kemungkinan memblokir iframe.
                Klik &quot;Buka demo live&quot; untuk membukanya di tab baru.
              </p>
            </aside>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
