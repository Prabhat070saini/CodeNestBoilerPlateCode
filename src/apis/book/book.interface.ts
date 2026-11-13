import {
  IBookDetails,
  IBookListing,
  IBookRecommendation,
} from './repository/interface';

export interface IBooksListingResponse {
  books: IBookListing[];
  total_count: number;
}

export interface IBookDetailsResponse {
  books: IBookDetails[];
  recommendations: IBookRecommendation[];
}
