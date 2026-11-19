import { Inject, Injectable, Logger } from '@nestjs/common';
import { TYPEORM_DATABASE_PROVIDER } from '../../../common/constants/app.constant';
import { DataSource } from 'typeorm';
import { IFunctionOutput } from '../../../common/constants/app.interface';
import { IBookDetails, IBookListing, IBookRecommendation } from './interface';
import { exception } from '../../../common/constants';

@Injectable()
export class BookRepository {
  private readonly logger = new Logger(BookRepository.name);
  constructor(
    @Inject(TYPEORM_DATABASE_PROVIDER) public readonly dataSource: DataSource,
  ) {}
  async getBooklist(
    pageIndex: number,
    pageSize: number,
    search?: string,
  ): Promise<IFunctionOutput<IBookListing[]>> {
    try {
      const query = `SELECT * FROM public.get_books_listing($1,$2,$3)`;
      const result = await this.dataSource.query(query, [
        pageIndex,
        pageSize,
        search,
      ]);
      return {
        data: result,
      };
    } catch (error) {
      this.logger.error(
        `message error `,
        error,
        'bookingrepository|getBooklist',
      );
      return { exception: exception.SOMETHING_WENT_WRONG };
    }
  }
  async getBookbyId(contentId: string): Promise<
    IFunctionOutput<{
      book: IBookDetails;
      recommendations: IBookRecommendation[];
    }>
  > {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      await queryRunner.query(
        'SELECT * FROM get_book_details_with_recommendations($1)',
        [contentId],
      );
      const recommendations = await queryRunner.query(
        'FETCH ALL FROM recommendation_result',
      );
      const books = await queryRunner.query('FETCH ALL FROM book_result');
      const book = books[0] as IBookDetails;
      if (!book) {
        await queryRunner.rollbackTransaction();
        return { exception: { code: 404, message: 'Book not found' } };
      }

      await queryRunner.commitTransaction();
      return {
        data: {
          book,
          recommendations: recommendations as IBookRecommendation[],
        },
      };
    } catch (error) {
      if (queryRunner.isTransactionActive) {
        await queryRunner.rollbackTransaction();
      }
      this.logger.error(
        `Error in getBookbyId: ${error instanceof Error ? `${error.message}|{error.stack}` : error}`,
      );
      return { exception: exception.SOMETHING_WENT_WRONG };
    } finally {
      await queryRunner.release();
    }
  }
}
