import { supabase } from "./supabaseClient";

/**
 * Upload image to user_uploads bucket
 */
export async function uploadToUserUploads(
  file: File,
  userId?: string
): Promise<{ path: string; url: string | null }> {
  try {
    // Create unique filename
    const ext = file.name.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const uuid = crypto.randomUUID();
    const path = `${userId || 'anon'}/${timestamp}_${uuid}.${ext}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('user_uploads')
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Try to get public URL first
    const { data: publicData } = supabase.storage
      .from('user_uploads')
      .getPublicUrl(path);

    return {
      path,
      url: publicData?.publicUrl || null,
    };
  } catch (error) {
    console.error('Error uploading to storage:', error);
    throw error;
  }
}

/**
 * Resolve any path or URL to a renderable URL
 */
export async function resolveImageUrl(pathOrUrl?: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;

  // Already a full URL - use as-is
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  // Blob or data URLs are temporary - cannot be resolved
  if (pathOrUrl.startsWith('blob:') || pathOrUrl.startsWith('data:')) {
    return null;
  }

  // It's a storage path - resolve it
  try {
    // Remove leading "user_uploads/" if present
    const cleanPath = pathOrUrl.replace(/^user_uploads\//, '');

    // Try signed URL first (works for private buckets)
    const { data: signedData, error: signedError } = await supabase.storage
      .from('user_uploads')
      .createSignedUrl(cleanPath, 3600); // 1 hour

    if (!signedError && signedData?.signedUrl) {
      return signedData.signedUrl;
    }

    // Fallback to public URL (works for public buckets)
    const { data: publicData } = supabase.storage
      .from('user_uploads')
      .getPublicUrl(cleanPath);

    return publicData?.publicUrl || null;
  } catch (error) {
    console.error('Error resolving image URL:', error);
    return null;
  }
}
