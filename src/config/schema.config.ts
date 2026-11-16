import * as Joi from 'joi';

export const envSchema = Joi.object({
  // App
  CORS_ORIGIN: Joi.string().required().default(''),
  X_API_KEY: Joi.string().required(),
  ENV_NAME: Joi.string().default('development'),
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug')
    .default('debug'),
  SERVER_HOST: Joi.string().default('localhost'),
  SERVER_PORT: Joi.number().port().default(3000),
  API_TOOL_ENABLED: Joi.boolean().required(),

  // Database
  DB_DIALECT: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_POOL_MIN: Joi.number().default(5),
  DB_POOL_MAX: Joi.number().default(20),
  DB_CONNECTION_TIMEOUT: Joi.number().default(3000),
  DB_LOGGING: Joi.boolean().default(true),
  DB_CONNECTION_IDLE_TIMEOUT: Joi.number().default(50),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().port().required(),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_CONNECTION_LIMIT: Joi.number().default(50),
  USE_REDIS: Joi.boolean().default(true),
  REDIS_RETRY_LIMIT: Joi.number().default(5),

  // Auth
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXP_IN_MIN: Joi.number().positive().required(),
  REFRESH_TOKEN_EXP_IN_MIN: Joi.number().positive().required(),

  // AWS
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_S3_BUCKET_NAME: Joi.string().required(),
  SIGNED_URL_EXPIRE: Joi.number().positive().required(),

  // Email
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().port().required(),
  EMAIL_USERNAME: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_FROM: Joi.string().required(),
  EMAIL_PROVIDER: Joi.string().required(),

  // Queue
  RABBITMQ_URL: Joi.string().required(),
  DEFAULT_RETRIES: Joi.number().required(),
  DEFAULT_RETRY_DELAY_MS: Joi.number().required(),
  IS_DLQ: Joi.boolean().required(),

  // OTP
  OTP_CRYPTO_SECRET: Joi.string().required(),
  OTP_TTL: Joi.number().required(),
  COOL_DOWN_TTL: Joi.number().required(),
  MAX_PER_HOUR: Joi.number().required(),
  MAX_ATTEMPTS: Joi.number().required(),
}).unknown(true);
