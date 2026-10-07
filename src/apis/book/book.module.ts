import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookRepository } from './repository/book.repository';

@Module({
  imports: [],
  controllers: [BookController],
  providers: [BookService, BookRepository],
  exports: [BookService],
})
export class BookModule {}
