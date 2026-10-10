/**
 * Video Helper Utilities
 * Supports YouTube streaming (1080p, continuous loop, audio control)
 * and direct MP4/WebM video formats.
 */

export const AKAAR_OFFICIAL_SHOWREEL_URL = 'https://youtu.be/epDa2WSMzIU';
export const AKAAR_OFFICIAL_SHOWREEL_ID = 'epDa2WSMzIU';
export const AKAAR_OFFICIAL_POSTER_URL = '/assets/akaar-poster.jpg';

/**
 * Extracts a YouTube Video ID from any standard URL format:
 * - youtu.be/<id>
 * - youtube.com/watch?v=<id>
 * - youtube.com/embed/<id>
 * - youtube.com/shorts/<id>
 */
export const getYouTubeId = (url?: string): string | null => {
  if (!url) return null;
  const trimmed = url.trim();
  // If it's already an 11-char ID
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed;

  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
};

/**
 * Extracts a Vimeo Video ID from a URL
 */
export const getVimeoId = (url?: string): string | null => {
  if (!url) return null;
  const match = url.trim().match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
  return match ? match[1] : null;
};

/**
 * Checks if a URL points to a direct HTML5 video format (mp4, webm, mov, ogg)
 */
export const isDirectVideoUrl = (url?: string): boolean => {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.ogg') ||
    clean.startsWith('blob:') ||
    clean.startsWith('data:video/')
  );
};

/**
 * Builds an optimized YouTube background streaming embed URL:
 * - loop=1 & playlist=<id> ensures continuous loop without stopping
 * - vq=hd1080 & hd=1 requests full 1080p quality
 * - modestbranding=1 & rel=0 & iv_load_policy=3 cleans UI distractions
 * - enablejsapi=1 allows JavaScript mute/unMute controls via postMessage
 */
export const getYouTubeBackgroundEmbedUrl = (
  videoId: string,
  options?: { isMuted?: boolean }
): string => {
  const isMuted = options?.isMuted ?? true;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    autoplay: '1',
    mute: isMuted ? '1' : '0',
    controls: '0',
    loop: '1',
    playlist: videoId,
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    disablekb: '1',
    fs: '0',
    iv_load_policy: '3',
    showinfo: '0',
    autohide: '1',
    wmode: 'transparent',
    vq: 'hd1080',
    hd: '1',
    suggestedQuality: 'hd1080',
  });
  if (origin) {
    params.set('origin', origin);
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Builds a YouTube Modal Player embed URL with interactive controls and 1080p
 */
export const getYouTubeModalEmbedUrl = (videoId: string, isMuted: boolean = false): string => {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    autoplay: '1',
    mute: isMuted ? '1' : '0',
    controls: '1',
    loop: '1',
    playlist: videoId,
    playsinline: '1',
    rel: '0',
    modestbranding: '1',
    enablejsapi: '1',
    vq: 'hd1080',
    hd: '1',
  });
  if (origin) {
    params.set('origin', origin);
  }
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Sends a command to a YouTube iframe via HTML5 postMessage
 */
export const sendYouTubeCommand = (
  iframe: HTMLIFrameElement | null,
  func: 'playVideo' | 'pauseVideo' | 'mute' | 'unMute' | 'setVolume' | 'setPlaybackQuality' | 'setPlaybackQualityRange',
  args: any[] = []
) => {
  if (!iframe || !iframe.contentWindow) return;
  try {
    iframe.contentWindow.postMessage(
      JSON.stringify({
        event: 'command',
        func,
        args,
      }),
      '*'
    );
  } catch {
    // Cross-origin safe guard
  }
};
