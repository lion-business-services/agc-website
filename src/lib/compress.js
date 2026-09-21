import { uploadRules } from "../config/estimate";

/**
 * Shrinks a phone photo (often 4–8 MB) to a ~200–500 KB JPEG in the browser,
 * so a whole set fits inside FormSubmit's 10 MB email attachment limit.
 */
export async function compressImage(file) {
  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, uploadRules.maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale), h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  const blob = await new Promise((res) => canvas.toBlob(res, "image/jpeg", uploadRules.quality));
  if (!blob) throw new Error("compress-failed");
  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

async function loadBitmap(file) {
  if ("createImageBitmap" in window) {
    try { return await createImageBitmap(file, { imageOrientation: "from-image" }); } catch { /* fall through */ }
  }
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = () => rej(new Error("unreadable-image"));
    img.src = URL.createObjectURL(file);
  });
}
