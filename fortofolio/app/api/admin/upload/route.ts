import type { NextRequest } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { randomId, readPortfolio, writePortfolio } from "@/lib/store";
import { slugify } from "@/lib/slug";
import { isAuthenticated } from "@/lib/auth";
import type { Project, Certificate } from "@/lib/types";

/**
 * API admin — kini dilindungi session login.
 * Menerima multipart form-data dan menulis file unggahan ke `data/uploads/`.
 */

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB

const ALLOWED_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".avif",
  ".gif",
  ".pdf",
]);

function extOf(name: string): string {
  return path.extname(name).toLowerCase();
}

function safeName(name: string): string {
  const base = slugify(path.basename(name, path.extname(name))) || "file";
  return `${base}-${randomId().toLowerCase()}${extOf(name)}`;
}

async function saveUpload(file: File): Promise<string> {
  const ext = extOf(file.name);
  if (!ALLOWED_EXT.has(ext)) {
    throw new Error(`Tipe file "${ext || file.name}" tidak diizinkan`);
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Ukuran file melebihi 8 MB");
  }
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const fileName = safeName(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, fileName), buffer);
  return `/api/files/${fileName}`;
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return Response.json(
      { error: "Tidak diizinkan. Silakan login dulu." },
      { status: 401 },
    );
  }

  try {
    const form = await request.formData();
    const kind = String(form.get("kind") || "");

    const data = await readPortfolio();
    const now = new Date().toISOString();

    if (kind === "project") {
      const title = String(form.get("title") || "").trim();
      const description = String(form.get("description") || "").trim();
      if (!title || !description) {
        return Response.json(
          { error: "Judul dan deskripsi wajib diisi." },
          { status: 400 },
        );
      }

      const tags = String(form.get("tags") || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      let screenshotPath: string | undefined;
      const screenshot = form.get("screenshot");
      if (screenshot instanceof File && screenshot.size > 0) {
        screenshotPath = await saveUpload(screenshot);
      }

      const slugBase = slugify(title) || "project";
      let slug = slugBase;
      let i = 2;
      while (data.projects.some((p) => p.slug === slug)) {
        slug = `${slugBase}-${i++}`;
      }

      const project: Project = {
        slug,
        title,
        description,
        tags,
        demoUrl: String(form.get("demoUrl") || "").trim() || undefined,
        repoUrl: String(form.get("repoUrl") || "").trim() || undefined,
        screenshotPath,
        createdAt: now,
      };

      data.projects.unshift(project);
    } else if (kind === "certificate") {
      const title = String(form.get("title") || "").trim();
      const issuer = String(form.get("issuer") || "").trim();
      if (!title || !issuer) {
        return Response.json(
          { error: "Judul dan penerbit wajib diisi." },
          { status: 400 },
        );
      }

      let filePath: string | undefined;
      const file = form.get("file");
      if (file instanceof File && file.size > 0) {
        filePath = await saveUpload(file);
      }

      const certificate: Certificate = {
        id: randomId(),
        title,
        issuer,
        issuedAt: String(form.get("issuedAt") || "") || now.slice(0, 10),
        url: String(form.get("url") || "").trim() || undefined,
        filePath,
        createdAt: now,
      };

      data.certificates.unshift(certificate);
    } else {
      return Response.json(
        { error: "kind harus 'project' atau 'certificate'." },
        { status: 400 },
      );
    }

    await writePortfolio(data);
    return Response.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan.";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return Response.json(
      { error: "Tidak diizinkan. Silakan login dulu." },
      { status: 401 },
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");
    const key = searchParams.get("key");
    if (!kind || !key) {
      return Response.json(
        { error: "Parameter kind dan key wajib." },
        { status: 400 },
      );
    }

    const data = await readPortfolio();
    if (kind === "project") {
      data.projects = data.projects.filter((p) => p.slug !== key);
    } else if (kind === "certificate") {
      data.certificates = data.certificates.filter((c) => c.id !== key);
    } else {
      return Response.json({ error: "kind tidak dikenal." }, { status: 400 });
    }

    await writePortfolio(data);
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Gagal menghapus." }, { status: 500 });
  }
}
