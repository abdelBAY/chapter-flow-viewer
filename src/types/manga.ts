
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
