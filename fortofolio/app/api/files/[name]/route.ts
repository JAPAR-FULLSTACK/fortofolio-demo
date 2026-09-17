import { promises as fs } from "fs";
import path from "path";

/**
 * Menyajikan file yang diunggah dari `data/uploads/`.
 * Folder `data/` berada di luar `public/`, jadi butuh handler ini.
 */

const UPLOAD_DIR = path.join(process.cwd(), "data", "uploads");

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
};

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/files/[name]">,
) {
  const { name } = await ctx.params;

  // Cegah path traversal: hanya nama file polos yang diizinkan.
  if (!/^[a-z0-9-]+(\.[a-z0-9]+)?$/i.test(name)) {
    return new Response("Nama file tidak valid.", { status: 400 });
  }

  const ext = path.extname(name).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return new Response("Tipe file tidak didukung.", { status: 415 });
  }

  try {
    const file = await fs.readFile(path.join(UPLOAD_DIR, path.basename(name)));
    return new Response(new Uint8Array(file), {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("File tidak ditemukan.", { status: 404 });
  }
}
