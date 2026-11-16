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
  'cache-control',
  'origin',
]);

// Success messages

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
  INVALID_ORIGIN: 1204,
  SESSION_EXPIRED: 1205,
  TOKEN_NOT_FOUND: 1206,
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
