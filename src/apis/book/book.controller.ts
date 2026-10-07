import { Controller, Get, Query, Param, Res } from '@nestjs/common';
import { BookService } from './book.service';
import { UtilsService } from '../../common/utils/utils.service';
import { BookListingDto } from './dto/book.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

@ApiTags('Book')
@Controller({ version: '1', path: 'book' })
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly utilsService: UtilsService,
  ) {}

  @ApiOperation({ summary: 'Get list of books' })
  @Get('list')
  async getBooklist(
    @Res() res: FastifyReply,
    @Query() query: BookListingDto,
  ): Promise<void> {
    const output = await this.bookService.getBooklist(query);
    return this.utilsService.sendRestResponse(res, output);
  }

  @ApiOperation({ summary: 'Get book by ID' })
  @Get(':id')
  async getBookbyId(
    @Res() res: FastifyReply,
    @Param('id') id: string,
  ): Promise<void> {
    const output = await this.bookService.getBookbyId(id);
    return this.utilsService.sendRestResponse(res, output);
  }
}
