// API Configuration
export const API_CONSTANTS = {
  PAGINATION_LIMIT: 10,
  MAX_PAGINATION_LIMIT: 50,
  SCROLL_THRESHOLD: 200,
} as const;

// Image Configuration
export const IMAGE_CONSTANTS = {
  DEFAULT_THUMBNAIL_WIDTH: 100,
  DEFAULT_THUMBNAIL_HEIGHT: 140,
} as const;

// Cache Configuration
export const CACHE_CONSTANTS = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  GC_TIME: 10 * 60 * 1000, // 10 minutes
} as const;
