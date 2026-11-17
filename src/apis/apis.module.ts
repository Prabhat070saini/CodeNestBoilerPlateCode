import { Module } from '@nestjs/common';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { TestingModule } from './testing/testing.module';
@Module({
  imports: [UserModule, BookModule, AuthModule, TestingModule],
  controllers: [],
  providers: [],
})
export class ApisModule {}
