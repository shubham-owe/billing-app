export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

export function downloadTextFile(
  filename: string,
  content: string,
  mime = "application/json"
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function fileToText(file: File): Promise<string> {
  return await file.text();
}

export async function resizeImageToDataUrl(
  file: File,
  maxWidth = 512,
  quality = 0.8
): Promise<string> {
  const imageBitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxWidth / imageBitmap.width);
  const width = Math.round(imageBitmap.width * ratio);
  const height = Math.round(imageBitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  context.drawImage(imageBitmap, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", quality);
}
