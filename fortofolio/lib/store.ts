import { promises as fs } from "fs";
import path from "path";
import type { PortfolioData } from "./types";

/**
 * Penyimpanan sederhana berbasis file JSON di folder `data/`.
 * Dipilih supaya portofolio bisa jalan tanpa database eksternal.
 * Kalau nanti butuh multi-user / cloud, cukup ganti isi file ini.
 */

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "portfolio.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

const EMPTY: PortfolioData = { projects: [], certificates: [] };

export async function readPortfolio(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as Partial<PortfolioData>;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      certificates: Array.isArray(parsed.certificates)
        ? parsed.certificates
        : [],
    };
  } catch {
    return EMPTY;
  }
}

export async function writePortfolio(data: PortfolioData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

export function randomId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  ).toUpperCase();
}

/** Statistik folder unggahan: jumlah file dan total ukuran (byte). */
export async function getUploadStats(): Promise<{
  files: number;
  bytes: number;
}> {
  try {
    const entries = await fs.readdir(UPLOAD_DIR);
    let files = 0;
    let bytes = 0;
    for (const name of entries) {
      const stat = await fs.stat(path.join(UPLOAD_DIR, name));
      if (stat.isFile()) {
        files += 1;
        bytes += stat.size;
      }
    }
    return { files, bytes };
  } catch {
    return { files: 0, bytes: 0 };
  }
}
