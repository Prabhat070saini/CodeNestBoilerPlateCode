import { Module } from '@nestjs/common';
import { TestingRepository } from './repository/testing.repository';

@Module({
  providers: [TestingRepository],
  exports: [TestingRepository],
})
export class TestingModule {}
