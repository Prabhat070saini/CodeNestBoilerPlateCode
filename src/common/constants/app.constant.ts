export const xApiKeyHeader = 'x-api-key';

export const TYPEORM_DATABASE_PROVIDER = 'TYPEORM_DATABASE_PROVIDER';

// Allowed request headers
export const ALLOWED_HEADERS = new Set([
  'host',
  'accept',
  'content-type',
  'content-length',
  'authorization',
  'x-api-key',
  'x-request-id',
  'user-agent',
  'accept-encoding',
  'connection',
]);

// Success messages
export const SUCCESS_MESSAGE = {
  USER_SIGNUP_SUCCESSFULLY: 'User signup successfully',
  USER_LOGIN_SUCCESSFULLY: 'User login successfully',
  USER_LOGOUT_SUCCESSFULLY: 'User logout successfully',
  USER_REFRESH_TOKEN_SUCCESSFULLY: 'User refresh token successfully',
  SEND_OTP_SUCCESSFULLY: 'OTP sent successfully',
  OTP_VERIFIED_SUCCESSFULLY: 'OTP verified successfully',
  SUCCESS: 'Success',
} as const;

// Exception messages
export const EXCEPTION_MESSAGE = {
  USER: {
    NOT_FOUND: 'User not found',
    DISABLE_USER: 'User is disabled',
    NOT_VERIFIED: 'User not verified',
  },
  AUTH: {
    UNAUTHORIZED_REQUEST: 'Authentication refused the request',
    PHONE_NOT_REGISTERED:
      'This Phone number is not registered in our system, You can send invite',
    BAD_REQUEST: 'Bad request',
    OTP_EXPIRED: 'Otp expired!, please regenerate otp',
    INVALID_OTP: 'Otp invalid!, please enter correct otp',
    EMAIL_ALREADY_EXIST: 'This email already exist',
    PERMISSION_DENINED: 'Permission Denied',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    INVALID_CREDENTIALS: 'Invalid credentials',
    API_KEY_MISSING: 'Unauthorized request',
    OTP_COOLDOWN_ACTIVE:
      'You are sending OTPs too quickly. Please wait before trying again.',
    OTP_RATE_LIMIT_REACHED:
      'You have reached the OTP request limit. Please try again later.',
    MAX_ATTEMPTS_REACHED:
      'Maximum OTP verification attempts reached. Please try again later.',
    INVALID_OR_EXPIRED_ACCESS_TOKEN: 'Invalid or expired token',
    INVALID_OR_EXPIRED_REFRESH_TOKEN: 'Invalid or expired token',
    HEADERS_NOT_FOUND: 'Security headers not found in request',
    PROTECTED_ROUTE: 'This route is protected',
    API_KEY_INVALID: 'Invalid API key provided',
  },
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again later.',
  NO_DATA_FOUND: 'No data found',
} as const;

// NOTE: Use only 10XX
export const APPLICATION_LAYER_EXCEPTION_CODES = {
  RESOURCE_NOT_EXISTS: 1000,
} as const;

// NOTE: Use only 11XX
export const DATABASE_EXCEPTION_CODES = {
  CONNECTION_TIMEOUT: 1100,
  CONNECTION_FAILED: 1101,
  CONNECTION_CLOSED: 1102,
  CONNECTION_LOST: 1105,
  DB_QUERY_ERROR: 1106,
} as const;

// NOTE: Use only 12XX
export const AUTHENTICATION_EXCEPTION_CODES = {
  NEW_TOKEN_GENERATED: 1200,
  INVALID_TOKEN: 1201,
  TOKEN_EXPIRED: 1202,
  INVALID_HEADER: 1203,
} as const;

// NOTE: Use only 13XX
export const THIRD_PARTY_EXCEPTION_CODES = {
  INVALID_ARGUMENT: 1301,
  FAIL_TO_WORK: 1302,
} as const;

// NOTE: Use only 14XX
export const VALIDATION_EXCEPTION_CODES = {} as const;

// NOTE: Use only 15XX
export const GENERAL_EXCEPTION_CODES = {
  GENERAL_ERROR: 1500,
  GENERAL_UNEXPECTED_ERROR: 1501,
  GENERAL_SYSTEM_FAILURE: 1502,
} as const;

// NOTE: Use only 50XX for encoding/decoding exceptions
export const ENCODING_EXCEPTION_CODES = {
  BASE_64_ENCODING_FAILED: 5001,
  BASE_64_DECODING_FAILED: 5002,
} as const;

// NOTE: Use only 51XX for encryption/decryption exceptions
export const CRYPTO_EXCEPTION_CODES = {
  ENCRYPTION_FAILED: 5101,
  DECRYPTION_FAILED: 5102,
} as const;

// NOTE: Use only 60XX for authentication/authorization exceptions
export const AUTH_EXCEPTION_CODES = {
  INVALID_OR_EXPIRED_ACCESS_TOKEN: 6001,
  INVALID_OR_EXPIRED_REFRESH_TOKEN: 6002,
  USER_NOT_VERIFIED: 6001,
  INVALID_REFRESH_TOKEN: 6002,
  INVALID_CREDENTIALS: 6003,
  API_KEY_MISSING: 6004,
} as const;

// NOTE: Use only 70XX for rate-limit exceptions
export const RATE_LIMIT_EXCEPTION_CODES = {
  OTP_COOLDOWN_ACTIVE: 7001,
  OTP_RATE_LIMIT_REACHED: 7002,
  MAX_ATTEMPTS_REACHED: 7003,
} as const;
