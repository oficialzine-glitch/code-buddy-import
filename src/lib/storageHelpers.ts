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
  
  // Construct public bucket URL
  return `https://${SUPABASE_PROJECT_ID}.supabase.co/storage/v1/object/public/${BUCKET_NAME}/${imagePath}`;
}
