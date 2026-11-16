import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { config } from '../..//config/config';
import { ETokenType } from '../constants/app.enum';
import { TokenService } from '../token/token.service';
import { ICacheProvider } from '../../core/cache/cache.interface';
import { CacheKeys } from '../../core/cache/keys';
import { FastifyRequest } from 'fastify';
import { CACHE_PROVIDER } from '../../core/cache/cache.constants';
import {
  AUTHENTICATION_EXCEPTION_CODES,
  EXCEPTION_MESSAGE,
} from '../constants';

@Injectable()
export class AuthnGuard implements CanActivate {
  private readonly logger = new Logger(AuthnGuard.name);
  constructor(
    private readonly tokenService: TokenService,
    @Inject(CACHE_PROVIDER) private readonly cacheService: ICacheProvider,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    // const token = request.headers.authorization?.split(' ')[1];
    const token = request.cookies?.access_token;
    if (!token) {
      this.logger.debug(`[canActivate] token not found`);
      throw new UnauthorizedException({
        message: EXCEPTION_MESSAGE.AUTH.UNAUTHORIZED_REQUEST,
        code: AUTHENTICATION_EXCEPTION_CODES.TOKEN_NOT_FOUND,
      });
    }

    const payload = this.tokenService.validate(ETokenType.AccessToken, token);
    if (!payload) {
      this.logger.debug(`[canActivate] Invalid or expire token`);
      throw new UnauthorizedException({
        code: AUTHENTICATION_EXCEPTION_CODES.INVALID_TOKEN,
        message: EXCEPTION_MESSAGE.AUTH.UNAUTHORIZED_REQUEST,
      });
    }

    if (config.redis.use_redis) {
      const accessToken = await this.cacheService.getKey(
        CacheKeys.auth.accessToken(payload.ref),
      );
      if (accessToken !== token) {
        this.logger.debug(`[canActivate] token not match with redis token`);
        throw new UnauthorizedException({
          message: EXCEPTION_MESSAGE.AUTH.UNAUTHORIZED_REQUEST,
          code: AUTHENTICATION_EXCEPTION_CODES.SESSION_EXPIRED,
        });
      }
    }

    request.user = {
      ref: payload.ref,
      type: payload.type,
      roles: ['MST001'],
    };

    return true;
  }
}
