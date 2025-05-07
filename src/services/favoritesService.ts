
import { Manga } from "../types/manga";
import { getMangaById } from "./mangaService";

/**
 * Get all favorite manga from localStorage
 */
export const getFavorites = async (): Promise<Manga[]> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  const favorites = await Promise.all(
    favoritesIds.map((id: string) => getMangaById(id))
  );
  // Filter out any undefined values in case a manga was removed
  return favorites.filter((manga): manga is Manga => manga !== undefined);
};

/**
 * Add a manga to favorites in localStorage
 */
export const addFavorite = (mangaId: string): Promise<void> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!favoritesIds.includes(mangaId)) {
    favoritesIds.push(mangaId);
    localStorage.setItem('favorites', JSON.stringify(favoritesIds));
  }
  return Promise.resolve();
};

/**
 * Remove a manga from favorites in localStorage
 */
export const removeFavorite = (mangaId: string): Promise<void> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  const updatedFavorites = favoritesIds.filter((id: string) => id !== mangaId);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  return Promise.resolve();
};

/**
 * Check if a manga is in favorites
 */
export const isFavorite = (mangaId: string): Promise<boolean> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  return Promise.resolve(favoritesIds.includes(mangaId));
};
