export interface Movie {
  title: string;
  year: number;
  genres?: string[];
  cast?: string[];
  extract: string;
  thumbnail: string;
}

export interface MovieResponse {
  data: Movie[];
  total: number;
  offset: number;
  limit: number;
  hasMore?: boolean;
}

export interface PaginationParams {
  pageParam?: number;
}
