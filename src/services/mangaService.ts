
import { Manga, Chapter, Page } from "../types/manga";
import { mockMangas, mockChaptersMap, generateMockPages } from "../mock/mangaData";

// Service functions for manga retrieval
export const getMangaList = (): Promise<Manga[]> => {
  return Promise.resolve(mockMangas);
};

export const getMangaById = (id: string): Promise<Manga | undefined> => {
  const manga = mockMangas.find(manga => manga.id === id);
  return Promise.resolve(manga);
};

// Service functions for chapter retrieval
export const getChaptersByMangaId = (mangaId: string): Promise<Chapter[]> => {
  const chapters = mockChaptersMap[mangaId] || [];
  return Promise.resolve(chapters);
};

export const getChapterById = (mangaId: string, chapterId: string): Promise<Chapter | undefined> => {
  const chapters = mockChaptersMap[mangaId] || [];
  const chapter = chapters.find(chapter => chapter.id === chapterId);
  return Promise.resolve(chapter);
};

// Service functions for page retrieval
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
