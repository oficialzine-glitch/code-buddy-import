const BUCKET_NAME = 'user_uploads';

// Derive base URL from environment to avoid hardcoding project refs
const SUPABASE_URL = (import.meta as any)?.env?.VITE_SUPABASE_URL?.replace(/\/+$/, '') || '';
const SUPABASE_PROJECT_ID = (import.meta as any)?.env?.VITE_SUPABASE_PROJECT_ID || (SUPABASE_URL ? new URL(SUPABASE_URL).hostname.split('.')[0] : '');
/**
 * Constructs a public URL from a storage path
 * @param storagePath - The path in the bucket (e.g., "uploads/user_id/filename.jpg")
 * @returns Full public URL to access the image
 */
export function publicUrlFromPath(storagePath: string | null | undefined): string {
  if (!storagePath) return '';
  
  // If it's already a full URL, return as is
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  
  // Normalize the path
  let normalizedPath = storagePath.trim().replace(/^\/+/, '');
  
  // Remove bucket name prefix if present
  if (normalizedPath.startsWith('user_uploads/')) {
    normalizedPath = normalizedPath.replace('user_uploads/', '');
  }
  
  // Construct public bucket URL
  const base = SUPABASE_URL || (SUPABASE_PROJECT_ID ? `https://${SUPABASE_PROJECT_ID}.supabase.co` : '');
  if (!base) {
    console.warn('Supabase base URL not configured. Unable to build public URL for', normalizedPath);
    return '';
  }
  return `${base}/storage/v1/object/public/${BUCKET_NAME}/${normalizedPath}`;
}

/**
 * Resolves image source with fallback for legacy formats
 * @param imageUrl - Could be a storage path, blob URL, or full URL
 * @returns Resolved image URL (blob URLs returned as-is for backward compat, but should be avoided)
 */
export function resolveImageSrc(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '';
  
  // If it's a blob URL (legacy), return as-is but this shouldn't be persisted
  if (imageUrl.startsWith('blob:')) {
    console.warn('Blob URL detected in resolveImageSrc - this should not be persisted to database');
    return imageUrl;
  }
  
  // If it's already a full http/https URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Otherwise treat it as a storage path
  return publicUrlFromPath(imageUrl);
}

/**
 * Legacy helper - prefer using publicUrlFromPath or resolveImageSrc
 * @deprecated Use publicUrlFromPath for storage paths or resolveImageSrc for mixed sources
 */
export function getPublicImageUrl(imagePath: string | null | undefined): string {
  return resolveImageSrc(imagePath);
}
