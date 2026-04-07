import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join, extname } from "path";
import { randomUUID } from "crypto";

const UPLOADS_DIR = join(process.cwd(), "data", "uploads");

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "File type not allowed. Accepted: JPEG, PNG, GIF, WebP" },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB" },
        { status: 400 }
      );
    }

    const originalName = file instanceof File ? file.name : "upload.jpg";
    const ext = extname(originalName) || ".jpg";
    const filename = `${randomUUID()}${ext}`;

    await mkdir(UPLOADS_DIR, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(join(UPLOADS_DIR, filename), buffer);

    return NextResponse.json({ filename }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to upload file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
