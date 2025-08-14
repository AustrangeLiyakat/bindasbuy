// Video URL processing utility for external platforms

export const processVideoUrl = (url: string, platform?: string): string => {
  // Remove any tracking parameters
  const cleanUrl = url.split('?')[0]
  
  // Instagram processing
  if (url.includes('instagram.com/reel/')) {
    const reelId = url.match(/\/reel\/([^/?]+)/)?.[1]
    if (reelId) {
      // Try to get the direct video URL (this might require additional processing)
      return `https://www.instagram.com/p/${reelId}/embed/captioned/`
    }
  }
  
  // YouTube processing
  if (url.includes('youtube.com/shorts/') || url.includes('youtu.be/')) {
    const videoId = url.match(/(?:shorts\/|youtu\.be\/|watch\?v=)([^&\n?#]+)/)?.[1]
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1&modestbranding=1&rel=0&iv_load_policy=3&enablejsapi=1`
    }
  }
  
  // TikTok processing
  if (url.includes('tiktok.com/')) {
    // TikTok embeds are more complex, but we'll try
    const videoId = url.match(/@[^/]+\/video\/(\d+)/)?.[1]
    if (videoId) {
      return `https://www.tiktok.com/embed/v2/${videoId}`
    }
  }
  
  return url
}

export const getVideoThumbnail = (url: string): string | undefined => {
  // YouTube thumbnail
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([^&\n?#]+)/)?.[1]
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    }
  }
  
  return undefined
}

export const getPlatformFromUrl = (url: string): string => {
  if (url.includes('instagram.com')) return 'instagram'
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('tiktok.com')) return 'tiktok'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter'
  return 'external'
}
