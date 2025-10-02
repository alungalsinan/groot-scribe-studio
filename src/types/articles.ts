export interface Article {
  id: string;
  title: string;
  summary: string;
  author: string;
  readingTime: number;
  publishedAt: string;
  category: string;
  imageUrl?: string;
  featured?: boolean;
  content?: string;
}