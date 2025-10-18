/**
 * Constructs a public URL for images stored in Supabase Storage
 * @param imagePath - The path to the image in the bucket (e.g., "user_id/filename.jpg")
 * @returns Full public URL to access the image
 */
export function getPublicImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '';
  
  const SUPABASE_PROJECT_ID = 'hebwatwkpszebonmrige';
  const BUCKET_NAME = 'user_uploads';
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Normalize the path
  let normalizedPath = imagePath.trim().replace(/^\/+/, '');
  
  // Remove bucket name prefix if present
  if (normalizedPath.startsWith('user_uploads/')) {
    normalizedPath = normalizedPath.replace('user_uploads/', '');
  }
  
  // If path is just a filename (no slashes), prefix with uploads/
  if (!normalizedPath.includes('/')) {
    normalizedPath = `uploads/${normalizedPath}`;
  }
  
  // Construct public bucket URL
  return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${normalizedPath}`;
}
