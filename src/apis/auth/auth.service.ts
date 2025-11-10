import { Injectable, Logger, Inject } from '@nestjs/common';
import { UserRepository } from '../user/repository/user.repository';
import { SignInDto, SignUpDto } from './dto/auth.dto';
import { EFindUser, ETokenType } from 'src/common/constants/app.enum';
import { exception } from 'src/common/constants/exception';
import { HashingService } from 'src/common/lib/hashing/hashing.service';
import { IUserCreate } from '../user/user.interface';
import {
  IServiceOutput,
  TokenPayload,
} from 'src/common/constants/app.interface';
import { TokenService } from 'src/common/token/token.service';
import { IGoogleOauthResponse, ISignInResponse } from './auth.interface';
import { UtilsService } from 'src/common/utils/utils.service';
import { AuthKeys } from 'src/shared/cache/keys';
import { CACHE_BASE, CacheBase } from 'src/shared/cache/cache.interface';
import { config } from '../../config/config';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly tokenService: TokenService,
    private readonly utilsService: UtilsService,
    @Inject(CACHE_BASE) private readonly cacheService: CacheBase,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<IServiceOutput<null>> {
    try {
      const { data: existingUser, exception: findUserExp } =
        await this.userRepository.findUser({
          valueType: EFindUser.EMAIL,
          value: signUpDto.email,
        });

      if (findUserExp) {
        this.logger.debug(`[signUp] ${JSON.stringify(findUserExp)}`);
        return { exception: findUserExp };
      }
      if (existingUser) {
        this.logger.debug(
          `[signUp] User already exit with email ${signUpDto.email}`,
        );
        return { exception: exception.EMAIL_ALREADY_EXIST };
      }

      const hashedPassword = await this.hashingService.hashPassword(
        signUpDto.password,
      );
      const newUser: IUserCreate = {
        name: signUpDto.name,
        email: signUpDto.email,
        password: hashedPassword,
      };

      const { exception: createUserExp } =
        await this.userRepository.createUser(newUser);
      if (createUserExp) {
        this.logger.debug(`[signUp] ${JSON.stringify(createUserExp)}`);
        return { exception: createUserExp };
      }
      return {
        success: {
          code: 200,
          message: 'User created successfully',
          data: null,
          httpStatusCode: 200,
        },
      };
    } catch (error) {
      this.logger.error(`[signUp] ${JSON.stringify(error)}`);
      return { exception: exception.INTERNAL_SERVER_ERROR };
    }
  }

  async signIn(signInDto: SignInDto): Promise<IServiceOutput<ISignInResponse>> {
    try {
      const { data: existingUser, exception: findUserExp } =
        await this.userRepository.findUser({
          valueType: EFindUser.EMAIL,
          value: signInDto.email,
        });

      if (findUserExp) {
        this.logger.debug(`[signIn] ${JSON.stringify(findUserExp)}`);
        return { exception: findUserExp };
      }
      if (!existingUser) {
        this.logger.debug(
          `[signIn] User not found with email ${signInDto.email}`,
        );
        return { exception: exception.USER_NOT_FOUND };
      }
      const isPasswordMatch = await this.hashingService.matchPassword(
        signInDto.password,
        existingUser.password,
      );
      if (!isPasswordMatch) {
        this.logger.debug(
          `[signIn] Invalid password for user ${signInDto.email}`,
        );
        return { exception: exception.INVALID_PASSWORD };
      }
      const accessTokenPayload: TokenPayload = {
        ref: existingUser.user_id,
        type: ETokenType.AccessToken,
      };
      const refreshTokenPayload: TokenPayload = {
        ref: existingUser.user_id,
        type: ETokenType.RefreshToken,
      };
      const accessToken = this.tokenService.generate(accessTokenPayload);
      const refreshToken = this.tokenService.generate(refreshTokenPayload);
      await this.cacheService.setKeyWithExpiry(
        AuthKeys.accessToken(existingUser.user_id),
        accessToken,
        config.token.access_token_exp_in_min,
      );
      await this.cacheService.setKeyWithExpiry(
        AuthKeys.refreshToken(existingUser.user_id),
        refreshToken,
        config.token.refresh_token_exp_in_min,
      );

      const resp: ISignInResponse = {
        accessToken,
        refreshToken,
        user_id: existingUser.user_id,
      };
      return {
        success: {
          code: 200,
          message: 'User logged in successfully',
          data: resp,
          httpStatusCode: 200,
        },
      };
    } catch (error) {
      this.logger.error(`[signIn] ${error}`);
      return { exception: exception.SOMETHING_WENT_WRONG };
    }
  }
  async validateGoogleUser(
    user: IGoogleOauthResponse,
  ): Promise<IServiceOutput<ISignInResponse>> {
    try {
      if (!user.isValid) {
        this.logger.debug(
          `[validateGoogleUser] User not verified with email ${user.email}`,
        );
        return { exception: exception.USER_NOT_VERIFIED };
      }

      let { data: existingUser, exception: findUserExp } =
        await this.userRepository.findUser({
          valueType: EFindUser.EMAIL,
          value: user.email,
        });
      if (findUserExp) {
        this.logger.debug(
          `[validateGoogleUser] ${JSON.stringify(findUserExp)}`,
        );
        return { exception: findUserExp };
      }
      if (!existingUser) {
        const randomPassword = this.utilsService.generatePassword();
        const hashedPassword =
          await this.hashingService.hashPassword(randomPassword);
        const newUser: IUserCreate = {
          name: user.name,
          email: user.email,
          password: hashedPassword,
        };

        const { data: createdUser, exception: createUserExp } =
          await this.userRepository.createUser(newUser);
        if (createUserExp) {
          this.logger.debug(`[signUp] ${JSON.stringify(createUserExp)}`);
          return { exception: createUserExp };
        }
        existingUser = createdUser;
      }

      const accessTokenPayload: TokenPayload = {
        ref: existingUser.user_id,
        type: ETokenType.AccessToken,
      };
      const refreshTokenPayload: TokenPayload = {
        ref: existingUser.user_id,
        type: ETokenType.RefreshToken,
      };
      const accessToken = this.tokenService.generate(accessTokenPayload);
      const refreshToken = this.tokenService.generate(refreshTokenPayload);
      const resp: ISignInResponse = {
        accessToken,
        refreshToken,
        user_id: existingUser.user_id,
      };
      return {
        success: {
          code: 200,
          message: 'User logged in successfully',
          data: resp,
          httpStatusCode: 200,
        },
      };
    } catch (error) {
      this.logger.error(`[validateGoogleUser] ${error}`);
      return { exception: exception.SOMETHING_WENT_WRONG };
    }
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<IServiceOutput<{ accessToken: string; refreshToken: string }>> {
    try {
      const verify = this.tokenService.validate(
        ETokenType.RefreshToken,
        refreshToken,
      );

      if (!verify?.payload) {
        this.logger.debug(`[refreshToken] Invalid refresh token`);
        return { exception: exception.INVALID_REFRESH_TOKEN };
      }

      const payload = verify.payload;

      if (config.redis.use_redis) {
        const storedRefreshToken = await this.cacheService.getKey(
          AuthKeys.refreshToken(payload.userId),
        );

        if (!storedRefreshToken || storedRefreshToken !== refreshToken) {
          this.logger.debug(`[refreshToken] Invalid refresh token`);
          return { exception: exception.INVALID_REFRESH_TOKEN };
        }
      }

      const accessTokenPayload: TokenPayload = {
        ref: payload.userId,
        type: ETokenType.AccessToken,
      };

      const accessToken = this.tokenService.generate(accessTokenPayload);

      if (config.redis.use_redis) {
        await this.cacheService.setKeyWithExpiry(
          AuthKeys.accessToken(payload.userId),
          accessToken,
          config.token.access_token_exp_in_min,
        );
      }

      const resp = {
        accessToken,
        refreshToken,
      };

      return {
        success: {
          code: 200,
          message: 'Token refreshed successfully',
          data: resp,
          httpStatusCode: 200,
        },
      };
    } catch (error) {
      this.logger.error(`[refreshToken] ${error}`);
      return { exception: exception.SOMETHING_WENT_WRONG };
    }
  }
}
