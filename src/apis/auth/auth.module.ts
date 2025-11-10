import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/repository/user.repository';
import { AuthController } from './auth.controller';
import { HashingService } from 'src/common/lib/hashing/hashing.service';

@Module({
  imports: [],
  providers: [AuthService, UserRepository, HashingService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
