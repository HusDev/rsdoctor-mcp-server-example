// Utility to get optimized Wikipedia image URLs
export function getOptimizedImageUrl(
  originalUrl: string,
  width: number = 100
): string {
  if (!originalUrl || !originalUrl.includes('wikimedia.org')) {
    return originalUrl;
  }

  // For Wikipedia images, we can use their thumbnail service
  // Replace the original URL with a thumbnail version
  if (originalUrl.includes('/wikipedia/')) {
    // Convert to thumbnail URL with specified width
    const filename = originalUrl.split('/').pop();
    if (filename) {
      return `https://upload.wikimedia.org/wikipedia/en/thumb/${
        originalUrl.split('/wikipedia/en/')[1]
      }/${width}px-${filename}`;
    }
  }

  return originalUrl;
}
