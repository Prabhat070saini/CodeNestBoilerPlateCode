import { Controller, Response, Get, Query } from '@nestjs/common';
import { BookService } from './book.service';
import { UtilsService } from '../../common/utils/utils.service';
import { BookListingDto } from './dto/book.dto';

@Controller({ version: '1', path: 'book' })
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly utilsService: UtilsService,
  ) {}
  @Get('list')
  async getBooklist(
    @Response() res,
    @Query() query: BookListingDto,
  ): Promise<void> {
    const output = await this.bookService.getBooklist(query);
    console.log('output', output);
    return this.utilsService.sendRestResponse(res, output);
  }
  @Get(':id')
  async getBookbyId(@Response() res): Promise<void> {
    const output = await this.bookService.getBookbyId(res.req.params.id);
    console.log('output', output);
    return this.utilsService.sendRestResponse(res, output);
  }
}
