// Helper to construct public storage URLs from the user_uploads bucket
const SUPABASE_URL = "https://hebwatwkpszebonmrige.supabase.co";
const BUCKET_NAME = "user_uploads";

export function getPublicImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // Construct the public URL for the user_uploads bucket
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${imagePath}`;
}
