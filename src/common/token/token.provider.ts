// src/common/jwt/token.provider.ts
import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtConfig,
  ITokenPayload,
} from '../../common/constants/app.interface';

@Injectable()
export class TokenProvider {
  private readonly logger = new Logger(TokenProvider.name);
  constructor(private readonly jwtService: JwtService) {}

  generateToken(config: IJwtConfig, payload: ITokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }

  validateToken(config: IJwtConfig, token: string): ITokenPayload {
    try {
      return this.jwtService.verify(token, { secret: config.secret });
    } catch (error) {
      this.logger.error(
        `Invalid or expired token: `,
        'TokenProvider.validateToken',
        error,
      );
      throw new Error('Invalid or expired token');
    }
  }
}
