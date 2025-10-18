import React, { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import { resolveImageUrl } from '../lib/storageImages';

interface StorageImageProps {
  pathOrUrl?: string | null;
  alt: string;
  className?: string;
  rounded?: boolean;
  onError?: () => void;
}

export default function StorageImage({
  pathOrUrl,
  alt,
  className = '',
  rounded = false,
  onError,
}: StorageImageProps) {
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function resolve() {
      setLoading(true);
      setError(false);

      try {
        const url = await resolveImageUrl(pathOrUrl);
        if (isMounted) {
          if (url) {
            setResolvedUrl(url);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Error resolving image:', err);
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    resolve();

    return () => {
      isMounted = false;
    };
  }, [pathOrUrl]);

  // Show loading placeholder
  if (loading) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-700/30 to-slate-800/30 animate-pulse flex items-center justify-center ${className} ${
          rounded ? 'rounded-full' : 'rounded-lg'
        }`}
      >
        <div className="w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show error placeholder
  if (error || !resolvedUrl) {
    return (
      <div
        className={`bg-gradient-to-br from-slate-700/40 to-slate-800/40 flex items-center justify-center ${className} ${
          rounded ? 'rounded-full' : 'rounded-lg'
        }`}
      >
        <ImageOff className="w-8 h-8 text-slate-500" />
      </div>
    );
  }

  // Show image
  return (
    <img
      src={resolvedUrl}
      alt={alt}
      className={className}
      onError={() => {
        setError(true);
        onError?.();
      }}
    />
  );
}
