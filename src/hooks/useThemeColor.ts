import { useMemo } from "react";

/**
 * Maps TMDB genre IDs to a cinematic color palette [r, g, b].
 * https://developer.themoviedb.org/reference/genre-movie-list
 */
const GENRE_COLORS: Record<number, [number, number, number]> = {
  28:    [220, 60,  20],   // Action      → fiery orange-red
  12:    [34,  170, 100],  // Adventure   → jungle green
  16:    [255, 180, 0],    // Animation   → vivid yellow
  35:    [255, 140, 30],   // Comedy      → warm orange
  80:    [80,  80,  180],  // Crime       → steel blue
  99:    [60,  160, 220],  // Documentary → clear sky blue
  18:    [180, 60,  140],  // Drama       → deep rose
  10751: [255, 200, 0],    // Family      → sunflower yellow
  14:    [120, 60,  200],  // Fantasy     → mystic purple
  36:    [160, 120, 50],   // History     → antique gold
  27:    [160, 20,  20],   // Horror      → blood red
  10402: [220, 80,  180],  // Music       → neon pink
  9648:  [40,  80,  160],  // Mystery     → midnight blue
  10749: [220, 80,  120],  // Romance     → rose pink
  878:   [0,   180, 220],  // Sci-Fi      → electric cyan
  10770: [180, 140, 60],   // TV Movie    → warm bronze
  53:    [60,  180, 100],  // Thriller    → cold teal-green
  10752: [140, 80,  40],   // War         → khaki brown
  37:    [200, 140, 60],   // Western     → desert sand
  // TV-specific
  10765: [0,   160, 200],  // Sci-Fi & Fantasy (TV) → cyan
  10759: [210, 60,  30],   // Action & Adventure (TV) → red-orange
};

const DEFAULT_COLOR: [number, number, number] = [229, 9, 20]; // Netflix red

function getColorForGenres(genreIds: number[]): [number, number, number] {
  if (!genreIds || genreIds.length === 0) return DEFAULT_COLOR;
  // Use the first recognised genre
  for (const id of genreIds) {
    if (GENRE_COLORS[id]) return GENRE_COLORS[id];
  }
  return DEFAULT_COLOR;
}

/**
 * Returns a [r, g, b] cinematic color for any movie or TV show
 * based on its genre_ids. Zero CORS issues, instant, 100% reliable.
 */
export function useThemeColor(movie: any): [number, number, number] {
  return useMemo(() => {
    if (!movie) return DEFAULT_COLOR;
    const genres: number[] = movie.genre_ids ?? movie.genres?.map((g: any) => g.id) ?? [];
    return getColorForGenres(genres);
  }, [movie?.id]);
}
