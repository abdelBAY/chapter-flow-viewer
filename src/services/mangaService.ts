
import { Manga, Chapter, Page, SearchFilters } from "../types/manga";
import { mockMangas, mockChaptersMap, generateMockPages } from "../mock/mangaData";

// Service functions
export const getMangaList = (): Promise<Manga[]> => {
  return Promise.resolve(mockMangas);
};

export const getMangaById = (id: string): Promise<Manga | undefined> => {
  const manga = mockMangas.find(manga => manga.id === id);
  return Promise.resolve(manga);
};

export const getChaptersByMangaId = (mangaId: string): Promise<Chapter[]> => {
  const chapters = mockChaptersMap[mangaId] || [];
  return Promise.resolve(chapters);
};

export const getChapterById = (mangaId: string, chapterId: string): Promise<Chapter | undefined> => {
  const chapters = mockChaptersMap[mangaId] || [];
  const chapter = chapters.find(chapter => chapter.id === chapterId);
  return Promise.resolve(chapter);
};

export const getPagesByChapterId = (chapterId: string): Promise<Page[]> => {
  const chapterIdParts = chapterId.split('-');
  const mangaId = chapterIdParts[0];
  const chapterNumber = parseInt(chapterIdParts[2]);
  
  const chapters = mockChaptersMap[mangaId] || [];
  const chapter = chapters.find(c => c.number === chapterNumber);
  
  if (!chapter) {
    return Promise.resolve([]);
  }
  
  return Promise.resolve(generateMockPages(chapterId, chapter.pages));
};

export const searchManga = (filters: SearchFilters): Promise<Manga[]> => {
  console.log("Search filters in service:", filters); // Debug log to see what filters are being passed
  
  let results = [...mockMangas];
  
  // Filter by search query
  if (filters.query && filters.query.trim() !== '') {
    const query = filters.query.toLowerCase().trim();
    console.log("Searching for:", query);
    
    results = results.filter(manga => 
      manga.title.toLowerCase().includes(query) || 
      (manga.description && manga.description.toLowerCase().includes(query))
    );
    
    console.log("Results after query filter:", results.length);
  }
  
  // Filter by genres - only if genres are specified and length > 0
  if (filters.genres && filters.genres.length > 0) {
    results = results.filter(manga => 
      filters.genres!.some(genre => manga.genres.includes(genre))
    );
    console.log("Results after genre filter:", results.length);
  }
  
  // Filter by status - only if status is specified and not 'all'
  if (filters.status && filters.status !== 'all') {
    results = results.filter(manga => manga.status === filters.status);
    console.log("Results after status filter:", results.length);
  }
  
  // Sort results
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'latest':
        results.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case 'oldest':
        results.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'alphabetical':
        results.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
  }
  
  console.log("Final search results:", results.length);
  return Promise.resolve(results);
};

// Favorites management (client-side only for now)
export const getFavorites = (): Promise<Manga[]> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  const favorites = mockMangas.filter(manga => favoritesIds.includes(manga.id));
  return Promise.resolve(favorites);
};

export const addFavorite = (mangaId: string): Promise<void> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  if (!favoritesIds.includes(mangaId)) {
    favoritesIds.push(mangaId);
    localStorage.setItem('favorites', JSON.stringify(favoritesIds));
  }
  return Promise.resolve();
};

export const removeFavorite = (mangaId: string): Promise<void> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  const updatedFavorites = favoritesIds.filter((id: string) => id !== mangaId);
  localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  return Promise.resolve();
};

export const isFavorite = (mangaId: string): Promise<boolean> => {
  const favoritesIds = JSON.parse(localStorage.getItem('favorites') || '[]');
  return Promise.resolve(favoritesIds.includes(mangaId));
};
