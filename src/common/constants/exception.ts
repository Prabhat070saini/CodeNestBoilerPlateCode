import { HttpStatus } from '@nestjs/common';
import { IException } from './app.interface';

export const exception: Record<string, IException> = {
  USER_UNAUTHORIZED_REQUEST: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'Authentication refused the request',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  PHONE_NOT_REGISTERED: {
    code: HttpStatus.UNAUTHORIZED,
    message:
      'This Phone number is not registered in our system, You can send invite',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  NO_DATA_FOUND: {
    code: HttpStatus.NOT_FOUND,
    message: 'No data found',
    httpStatusCode: HttpStatus.NOT_FOUND,
  },
  USER_NOT_FOUND: {
    code: HttpStatus.NOT_FOUND,
    message: 'User not found',
    httpStatusCode: HttpStatus.NOT_FOUND,
  },
  BAD_REQUEST: {
    code: HttpStatus.BAD_REQUEST,
    message: 'Bad request',
    httpStatusCode: HttpStatus.BAD_REQUEST,
  },
  SOMETHING_WENT_WRONG: {
    code: HttpStatus.INTERNAL_SERVER_ERROR,
    message: 'Something went wrong ,Try again alter',
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  OTP_EXPIRED: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'Otp expired!, please regenerate otp',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  INVALID_OTP: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'Otp invalid!, please enter correct otp',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  EMAIL_ALREADY_EXIST: {
    code: HttpStatus.CONFLICT,
    message: 'This email already exist',
    httpStatusCode: HttpStatus.CONFLICT,
  },
  DISABLE_USER: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'User is disabled',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  HEADERS_NOT_FOUND: {
    code: HttpStatus.UNAUTHORIZED,
    message: 'Security headers not found in request',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  PERMISSION_DENINED: {
    code: HttpStatus.FORBIDDEN,
    message: 'Permission Denied',
    httpStatusCode: HttpStatus.FORBIDDEN,
  },
  PROTECTED_ROUTE: {
    code: HttpStatus.FORBIDDEN,
    message: 'This route is protected',
    httpStatusCode: HttpStatus.FORBIDDEN,
  },
  API_KEY_INVALID: {
    code: HttpStatus.FORBIDDEN,
    message: 'Invalid API key provided',
    httpStatusCode: HttpStatus.FORBIDDEN,
  },
  INVALID_OR_EXPIRED_ACCESS_TOKEN: {
    code: 6001, // call refresh token code
    message: 'Invalid or expired token',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  INVALID_OR_EXPIRED_REFRESH_TOKEN: {
    code: 6002, // logout user code
    message: 'Invalid or expired token',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  BASE_64_DECODING_FAILED: {
    code: 5002,
    message: `Something went wrong`,
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  BASE_64_ENCODING_FAILED: {
    code: 5001,
    message: `Something went wrong`,
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  ENCRYPTION_FAILED: {
    code: 5101,
    message: 'Something went wrong',
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  DECRYPTION_FAILED: {
    code: 5102,
    message: 'Something went wrong',
    httpStatusCode: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  USER_NOT_VERIFIED: {
    code: 6001,
    message: 'User not verified',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
  INVALID_REFRESH_TOKEN: {
    code: 6002,
    message: 'Invalid refresh token',
    httpStatusCode: HttpStatus.UNAUTHORIZED,
  },
};
