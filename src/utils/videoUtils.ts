/**
 * Video Utilities for Akaar Agency
 * Handles YouTube video ID extraction, embed generation, and video streaming helpers.
 */

export function extractYouTubeId(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If already an 11-character YouTube video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches youtu.be/<id>, youtube.com/watch?v=<id>, youtube.com/embed/<id>, youtube.com/shorts/<id>
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );

  return match ? match[1] : null;
}

export function isYouTubeUrl(url?: string): boolean {
  return !!extractYouTubeId(url);
}

interface YouTubeEmbedOptions {
  autoplay?: boolean;
  mute?: boolean;
  loop?: boolean;
  controls?: boolean;
  playsinline?: boolean;
  modestbranding?: boolean;
  origin?: string;
  enablejsapi?: boolean;
}

export function getYouTubeEmbedUrl(videoId: string, options: YouTubeEmbedOptions = {}): string {
  const {
    autoplay = true,
    mute = true,
    loop = true,
    controls = false,
    playsinline = true,
    modestbranding = true,
    enablejsapi = true,
    origin,
  } = options;

  const params = new URLSearchParams();

  if (autoplay) params.set('autoplay', '1');
  if (mute) params.set('mute', '1');
  else params.set('mute', '0');

  if (controls) params.set('controls', '1');
  else params.set('controls', '0');

  // For looping in YouTube embed, playlist MUST match the videoId
  if (loop) {
    params.set('loop', '1');
    params.set('playlist', videoId);
  }

  if (playsinline) params.set('playsinline', '1');
  if (modestbranding) params.set('modestbranding', '1');
  if (enablejsapi) params.set('enablejsapi', '1');

  params.set('rel', '0');
  params.set('showinfo', '0');
  params.set('iv_load_policy', '3');
  params.set('disablekb', '1');
  params.set('fs', '0');
  params.set('hd', '1');
  params.set('vq', 'hd1080'); // Force 1080p Full HD playback quality

  if (origin) {
    params.set('origin', origin);
  }

  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
}
