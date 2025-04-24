export interface Manga {
  id: string;
  title: string;
  cover: string;
  description: string;
  author: string;
  artist: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  genres: string[];
  createdAt: string;
  updatedAt: string;
  recentChapters?: Chapter[];
}

export interface Chapter {
  id: string;
  mangaId: string;
  number: number;
  title: string;
  createdAt: string;
  pages: number;
}

export interface Page {
  id: string;
  chapterId: string;
  pageNumber: number;
  imageUrl: string;
}

export interface SearchFilters {
  query?: string;
  genres?: string[];
  status?: 'ongoing' | 'completed' | 'hiatus' | 'all';
  sortBy?: 'latest' | 'oldest' | 'alphabetical';
}

// Database specific types - represent the actual structure from Supabase
export interface MangaFromDB {
  id: string;
  title: string;
  cover_url: string;
  description: string;
  author: string;
  artist: string;
  status: 'ongoing' | 'completed' | 'hiatus';
  created_at: string;
  updated_at: string;
}

export interface ChapterFromDB {
  id: string;
  manga_id: string;
  number: number;
  title: string;
  created_at: string;
  updated_at: string;
  pages: number;
}

export interface PageFromDB {
  id: string;
  chapter_id: string;
  page_number: number;
  image_url: string;
  created_at: string;
}

// Adapters to convert from DB to frontend models
export const adaptMangaFromDB = (dbManga: MangaFromDB, genres: string[] = []): Manga => ({
  id: dbManga.id,
  title: dbManga.title,
  cover: dbManga.cover_url || '',
  description: dbManga.description || '',
  author: dbManga.author,
  artist: dbManga.artist,
  status: dbManga.status,
  genres: genres,
  createdAt: dbManga.created_at,
  updatedAt: dbManga.updated_at
});

export const adaptChapterFromDB = (dbChapter: ChapterFromDB): Chapter => ({
  id: dbChapter.id,
  mangaId: dbChapter.manga_id,
  number: dbChapter.number,
  title: dbChapter.title,
  createdAt: dbChapter.created_at,
  pages: dbChapter.pages
});

export const adaptPageFromDB = (dbPage: PageFromDB): Page => ({
  id: dbPage.id,
  chapterId: dbPage.chapter_id,
  pageNumber: dbPage.page_number,
  imageUrl: dbPage.image_url
});
