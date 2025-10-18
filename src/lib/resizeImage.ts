export async function resizeToMax1080(file: File): Promise<{ dataUrl: string; w: number; h: number }> {
  const img = new Image();
  const blobUrl = URL.createObjectURL(file);
  
  try {
    await new Promise<void>((res, rej) => {
      img.onload = () => res();
      img.onerror = (e) => rej(e);
      img.src = blobUrl;
    });

    const maxSide = 1080;
    let { width, height } = img;
    const scale = Math.min(1, maxSide / Math.max(width, height));
    const targetW = Math.round(width * scale);
    const targetH = Math.round(height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, targetW, targetH);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    return { dataUrl, w: targetW, h: targetH };
  } finally {
    // Always clean up the blob URL
    URL.revokeObjectURL(blobUrl);
  }
}
