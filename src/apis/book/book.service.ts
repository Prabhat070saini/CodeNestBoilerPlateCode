import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { BookRepository } from './repository/book.repository';
import { IServiceOutput } from '../../common/constants/app.interface';
import { SUCCESS_MESSAGE } from '../../common/constants/app.constant';
import { exception } from '../../common/constants/exception';
import { IBookDetailsResponse, IBooksListingResponse } from './book.interface';
import { BookListingDto } from './dto/book.dto';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);
  constructor(private readonly bookRepository: BookRepository) {}

  async getBooklist(
    query: BookListingDto,
  ): Promise<IServiceOutput<IBooksListingResponse>> {
    try {
      const { search, pageSize, pageIndex } = query;
      const { data: books, exception } = await this.bookRepository.getBooklist(
        pageIndex,
        pageSize,
        search,
      );
      console.log('books', books, 'exception', exception);
      if (exception) {
        this.logger.log(
          `Error in getBooklist: ${exception.code}|${exception.message}`,
          'BookService',
        );
        return { exception: exception };
      }

      return {
        success: {
          code: HttpStatus.OK,
          message: SUCCESS_MESSAGE.SUCCESS,
          data: {
            books: books,
            total_count: Number(books[0]?.total_count) || 0,
          },
          httpStatusCode: HttpStatus.OK,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error in getBooklist: ${error instanceof Error ? `${error.message}|{error.stack}` : error}`,
        'BookService',
      );
      return { exception: exception.SOMETHING_WENT_WRONG };
    }
  }

  async getBookbyId(
    contentId: string,
  ): Promise<IServiceOutput<IBookDetailsResponse>> {
    try {
      this.logger.log('getBookbyId called');
      const { data, exception } =
        await this.bookRepository.getBookbyId(contentId);
      this.logger.log(
        `getBookbyId result: ${JSON.stringify(data)}`,
        'BookService',
      );
      if (exception) {
        this.logger.log(
          `Error in getBookbyId: ${exception.code}|${exception.message}`,
          'BookService',
        );
        return { exception: exception };
      }
      return {
        success: {
          code: HttpStatus.OK,
          message: SUCCESS_MESSAGE.SUCCESS,
          data: {
            books: [data.book],
            recommendations: data.recommendations,
          },
          httpStatusCode: HttpStatus.OK,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error in getBookbyId: ${error instanceof Error ? `${error.message}|{error.stack}` : error}`,
        'BookService',
      );
      return { exception: exception.SOMETHING_WENT_WRONG };
    }
  }
}
