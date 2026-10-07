export interface BookListing {
  content_id: string;
  isbn: string;
  publisher: string;
  page_count: number;
  edition: string;
  description: string;
  cover_image_url: string;
  language: string;
  title: string;
  author_name: string;
  bio: string;
  total_count: string;
}

export interface BookDetails {
  id: string;
  content_type: string;
  title: string;
  description: string;
  cover_image_url: string;
  language: string;
  status: string;
  published_at: Date;
  isbn: string;
  publisher: string;
  page_count: number;
  edition: string;
}

export interface BookRecommendation {
  score: string;
  recommendation_type: string;
  id: string;
  content_type: string;
  title: string;
  description: string;
  cover_image_url: string;
  language: string;
  status: string;
  published_at: Date;
}
