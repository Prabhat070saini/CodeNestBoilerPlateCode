import {
  BookDetails,
  BookListing,
  BookRecommendation,
} from './repository/interface';

export interface IBooksListingResponse {
  books: BookListing[];
  total_count: number;
}

export interface IBookDetailsResponse {
  books: BookDetails[];
  recommendations: BookRecommendation[];
}
