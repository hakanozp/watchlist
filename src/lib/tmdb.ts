import type { TMDBSearchResult } from '../types/media';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
const BASE_URL = 'https://api.themoviedb.org/3';
export const POSTER_BASE = 'https://image.tmdb.org/t/p/w300';

export async function searchTMDB(query: string): Promise<TMDBSearchResult[]> {
  if (!query.trim() || !API_KEY) return [];

  const url = `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=tr-TR&include_adult=false`;
  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  return (data.results as TMDBSearchResult[]).filter(
    (r) => r.media_type === 'movie' || r.media_type === 'tv'
  );
}

export function posterUrl(path: string | null): string | null {
  return path ? `${POSTER_BASE}${path}` : null;
}
