
import { Manga, Chapter, Page, SearchFilters } from "../types/manga";

// Mock data for demonstration
const mockMangas: Manga[] = [
  {
    id: "1",
    title: "One Piece",
    cover: "https://via.placeholder.com/300x450?text=One+Piece",
    description: "Follow Monkey D. Luffy and his swashbuckling crew in their search for the ultimate treasure, One Piece.",
    author: "Eiichiro Oda",
    artist: "Eiichiro Oda",
    status: "ongoing",
    genres: ["Action", "Adventure", "Comedy", "Fantasy"],
    createdAt: "1997-07-22",
    updatedAt: "2023-04-15"
  },
  {
    id: "2",
    title: "Naruto",
    cover: "https://via.placeholder.com/300x450?text=Naruto",
    description: "Follow the journey of Naruto Uzumaki, a young ninja seeking recognition and dreaming of becoming the Hokage, the leader of his village.",
    author: "Masashi Kishimoto",
    artist: "Masashi Kishimoto",
    status: "completed",
    genres: ["Action", "Adventure", "Fantasy", "Martial Arts"],
    createdAt: "1999-09-21",
    updatedAt: "2014-11-10"
  },
  {
    id: "3",
    title: "Attack on Titan",
    cover: "https://via.placeholder.com/300x450?text=Attack+on+Titan",
    description: "In a world where humanity lives within cities surrounded by enormous walls protecting themselves from Titans, giant humanoid creatures.",
    author: "Hajime Isayama",
    artist: "Hajime Isayama",
    status: "completed",
    genres: ["Action", "Dark Fantasy", "Post-Apocalyptic"],
    createdAt: "2009-09-09",
    updatedAt: "2021-04-09"
  },
  {
    id: "4",
    title: "My Hero Academia",
    cover: "https://via.placeholder.com/300x450?text=My+Hero+Academia",
    description: "In a world where people with superpowers known as 'Quirks' are the norm, Izuku Midoriya has dreams of becoming a hero despite being Quirkless.",
    author: "Kohei Horikoshi",
    artist: "Kohei Horikoshi",
    status: "ongoing",
    genres: ["Action", "Superhero", "School", "Sci-Fi"],
    createdAt: "2014-07-07",
    updatedAt: "2023-03-27"
  },
  {
    id: "5",
    title: "Demon Slayer",
    cover: "https://via.placeholder.com/300x450?text=Demon+Slayer",
    description: "Tanjiro Kamado and his sister Nezuko are the sole survivors of an incident where a demon slaughtered their entire family. Tanjiro becomes a demon slayer to avenge his family and cure his sister.",
    author: "Koyoharu Gotouge",
    artist: "Koyoharu Gotouge",
    status: "completed",
    genres: ["Action", "Dark Fantasy", "Martial Arts", "Historical"],
    createdAt: "2016-02-15",
    updatedAt: "2020-05-18"
  },
  {
    id: "6",
    title: "Jujutsu Kaisen",
    cover: "https://via.placeholder.com/300x450?text=Jujutsu+Kaisen",
    description: "Yuji Itadori is an ordinary high school student with extraordinary physical abilities. After consuming a cursed object, he becomes host to Sukuna, a powerful curse.",
    author: "Gege Akutami",
    artist: "Gege Akutami",
    status: "ongoing",
    genres: ["Action", "Supernatural", "Horror", "School"],
    createdAt: "2018-03-05",
    updatedAt: "2023-04-10"
  }
];

// Mock chapters
const generateMockChapters = (mangaId: string, count: number): Chapter[] => {
  const chapters: Chapter[] = [];
  for (let i = 1; i <= count; i++) {
    chapters.push({
      id: `${mangaId}-chapter-${i}`,
      mangaId,
      number: i,
      title: `Chapter ${i}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      pages: Math.floor(Math.random() * 20) + 15,
    });
  }
  return chapters;
};

// Mock mapping of manga IDs to chapters
const mockChaptersMap: Record<string, Chapter[]> = {
  "1": generateMockChapters("1", 1080),
  "2": generateMockChapters("2", 700),
  "3": generateMockChapters("3", 139),
  "4": generateMockChapters("4", 350),
  "5": generateMockChapters("5", 205),
  "6": generateMockChapters("6", 220),
};

// Mock pages
const generateMockPages = (chapterId: string, pageCount: number): Page[] => {
  const pages: Page[] = [];
  for (let i = 1; i <= pageCount; i++) {
    pages.push({
      id: `${chapterId}-page-${i}`,
      chapterId,
      pageNumber: i,
      imageUrl: `https://via.placeholder.com/800x1200?text=Page+${i}`,
    });
  }
  return pages;
};

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
  let results = [...mockMangas];
  
  // Filter by search query
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(manga => 
      manga.title.toLowerCase().includes(query) || 
      manga.description.toLowerCase().includes(query)
    );
  }
  
  // Filter by genres
  if (filters.genres && filters.genres.length > 0) {
    results = results.filter(manga => 
      filters.genres!.some(genre => manga.genres.includes(genre))
    );
  }
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    results = results.filter(manga => manga.status === filters.status);
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
