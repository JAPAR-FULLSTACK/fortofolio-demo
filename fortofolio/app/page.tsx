import { readPortfolio } from "@/lib/store";
import SiteNav from "@/components/site-nav";
import Hero from "@/components/hero";
import ProjectGrid from "@/components/project-grid";
import CertificateRack from "@/components/certificate-rack";
import SiteFooter from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { projects, certificates } = await readPortfolio();

  return (
    <>
      {/* Progress bar scroll — hanya tampil jika browser mendukung (lihat CSS) */}
      <div className="scroll-progress" aria-hidden="true" />
      <SiteNav />
      <main className="flex-1">
        <Hero
          projectCount={projects.length}
          certificateCount={certificates.length}
        />
        <ProjectGrid projects={projects} />
        <CertificateRack certificates={certificates} />
      </main>
      <SiteFooter />
    </>
  );
}
