import { config } from '../../config/config';
import { EApplicationEnvironmentType, ETokenType } from './app.enum';

export type JwtExpires = `${number}${'s' | 'm' | 'h' | 'd'}` | number;

export interface IJwtConfig {
  secret: string;
  expiresIn: JwtExpires; // e.g., '1h', '7d', etc.
  type: ETokenType;
}

export interface ITokenPayload {
  ref?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
  type: ETokenType;
}
export interface IException {
  code: number;
  message: string;
  httpStatusCode?: number;
}

export interface ISuccess<T> {
  code: number;
  message: string;
  httpStatusCode: number;
  data?: T;
}

export interface IServiceOutput<T> {
  success?: ISuccess<T>;
  exception?: IException;
}

export interface IFunctionOutput<T> {
  data?: T;
  exception?: IException;
}

export interface ISuccessResponse<T = undefined> {
  success: {
    code: number;
    message: string;
    data?: T;
    httpStatusCode: number;
  };
}

export const cookieConfig = {
  accessToken: {
    httpOnly: true,
    secure: config.env === EApplicationEnvironmentType.PRODUCTION,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: config.token.access_token_exp_in_min * 60,
  },

  refreshToken: {
    httpOnly: true,
    secure: config.env === EApplicationEnvironmentType.PRODUCTION,
    sameSite: 'lax' as const,
    path: '/api/v1/auth/refresh',
    maxAge: config.token.refresh_token_exp_in_min * 60,
  },
};
