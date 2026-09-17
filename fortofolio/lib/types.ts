export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  demoUrl?: string;
  repoUrl?: string;
  screenshotPath?: string;
  createdAt: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string;
  issuedAt: string;
  url?: string;
  filePath?: string;
  createdAt: string;
};

export type PortfolioData = {
  projects: Project[];
  certificates: Certificate[];
};
