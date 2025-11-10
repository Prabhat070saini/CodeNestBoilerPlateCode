import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { config } from 'src/config/config';
import { ETokenType } from '../constants/app.enum';
import { TokenService } from '../token/token.service';
import { CacheBase } from 'src/shared/cache/cache.interface';
import { CACHE_BASE } from 'src/shared/cache/cache.interface';

@Injectable()
export class AuthnGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    @Inject(CACHE_BASE) private cacheService: CacheBase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException({
        message: 'token not found',
        code: 401,
      });
    }

    const verify = this.tokenService.validate(ETokenType.AccessToken, token);
    if (!verify.payload) {
      throw new UnauthorizedException({
        code: 9099,
        message: 'Invalid or expire token',
      });
    }

    const payload = verify.payload;

    if (config.redis.use_redis) {
      const accessToken = await this.cacheService.getKey(
        `accessToken:${payload.userId}`,
      );

      if (!accessToken) {
        throw new UnauthorizedException({
          message: 'Session expired or token not found in Redis',
          code: 5011,
        });
      }
      if (accessToken !== token) {
        throw new UnauthorizedException({
          message: 'Invalid or expire token a',
          code: 5010,
        });
      }
    }

    request.user = {
      id: payload.userId,
      roles: payload.roles,
    };

    return true;
  }
}
