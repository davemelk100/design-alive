export interface NewsItem {
  id: number;
  title: string;
  source: string;
  url: string;
  publishedDate: string;
  author: string;
  excerpt: string;
  category: string;
  isRss?: boolean;
  image?: string;
  videoUrl?: string;
  videoDuration?: string;
  videoType?: string;
}

export interface RSSFeed {
  id: string;
  name: string;
  url: string;
  category: string;
  enabled: boolean;
}

export type ViewMode = "grid" | "list";
export type NewsCategory =
  | "all"
  | "technology"
  | "sports"
  | "business"
  | "entertainment"
  | "food"
  | "politics"
  | "custom";

