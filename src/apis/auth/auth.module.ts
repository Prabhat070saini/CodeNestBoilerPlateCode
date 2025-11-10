import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/repository/user.repository';
import { AuthController } from './auth.controller';
import { HashingService } from 'src/common/lib/hashing/hashing.service';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, UserRepository, HashingService, GoogleStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
