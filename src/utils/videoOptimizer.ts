export interface OptimizedVideoInfo {
  type: "direct" | "gdrive" | "youtube" | "vimeo" | "none";
  embedUrl?: string;
  streamUrl?: string;
  originalUrl: string;
}

export function parseOptimizedVideo(rawUrl?: string): OptimizedVideoInfo {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { type: "none", originalUrl: "" };
  }
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return { type: "none", originalUrl: "" };
  }

  // 1. Google Drive Links:
  // e.g. https://drive.google.com/file/d/1A2B3C4D5E_XYZ/view?usp=sharing
  // or https://drive.google.com/open?id=1A2B3C4D5E_XYZ
  let parsedUrl: URL | null = null;
  try {
    parsedUrl = new URL(trimmed);
  } catch {
    parsedUrl = null;
  }

  const isGoogleDriveUrl = parsedUrl?.hostname === "drive.google.com";
  const driveFileId = isGoogleDriveUrl
    ? parsedUrl.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || parsedUrl.searchParams.get("id")
    : null;
  if (driveFileId) {
    return {
      type: "gdrive",
      embedUrl: `https://drive.google.com/file/d/${driveFileId}/preview?embedded=true&rm=minimal`,
      streamUrl: `https://drive.google.com/uc?export=download&id=${driveFileId}`,
      originalUrl: trimmed,
    };
  }

  // 2. YouTube Links
  const hostname = parsedUrl?.hostname.replace(/^www\./, "");
  const youtubeVideoId = hostname === "youtu.be"
    ? parsedUrl.pathname.split("/").filter(Boolean)[0]
    : hostname === "youtube.com" || hostname === "m.youtube.com" || hostname === "youtube-nocookie.com"
      ? parsedUrl.searchParams.get("v") || parsedUrl.pathname.match(/^\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]+)/)?.[1]
      : null;
  if (youtubeVideoId) {
    const videoId = youtubeVideoId;
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&modestbranding=1`,
      originalUrl: trimmed,
    };
  }

  // 3. Vimeo Links
  const vimeoId = hostname === "vimeo.com" || hostname === "player.vimeo.com"
    ? parsedUrl.pathname.match(/\/(?:video\/)?([0-9]+)/)?.[1]
    : null;
  if (vimeoId) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`,
      originalUrl: trimmed,
    };
  }

  // 4. Direct video link (e.g. .mp4, .webm, CDN, S3, Cloudflare Stream)
  return {
    type: "direct",
    streamUrl: trimmed,
    originalUrl: trimmed,
  };
}
