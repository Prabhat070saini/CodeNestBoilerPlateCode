import { env } from './validation.config';
//  Export typed config object
export const config = {
  env: env.ENV_NAME,
  cors: {
    origins: env.CORS_ORIGIN.split(',')
      .map((origin: string) => origin.trim())
      .filter(Boolean),
  },
  api_key: {
    x_api_key: env.X_API_KEY,
  },
  log_level: env.LOG_LEVEL,
  app: {
    host: env.SERVER_HOST,
    port: env.SERVER_PORT,
    api_tool_enabled: env.API_TOOL_ENABLED,
  },
  db: {
    dialect: env.DB_DIALECT,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    db_connection_timeout: env.DB_CONNECTION_TIMEOUT,
    db_pool_min: env.DB_POOL_MIN,
    db_pool_max: env.DB_POOL_MAX,
    logging: env.DB_LOGGING,
    db_connection_idle_timeout: env.DB_CONNECTION_IDLE_TIMEOUT,
  },
  mongodb: {
    uri: env.MONGODB_URI,
    max_pool_size: env.MONGODB_MAX_POOL,
    min_pool_size: env.MONGODB_MIN_POOL,
    server_selection_timeout_ms: env.MONGODB_SERVER_SELECTION_TIMEOUT,
    connect_timeout_ms: env.MONGODB_CONNECT_TIMEOUT,
    socket_timeout_ms: env.MONGODB_SOCKET_TIMEOUT,
    heartbeat_frequency_ms: env.MONGODB_HEARTBEAT_FREQUENCY,
    retry_attempts: env.MONGODB_RETRY_ATTEMPTS,
    retry_delay_ms: env.MONGODB_RETRY_DELAY,
  },
  redis: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    db_connection_limit: env.REDIS_CONNECTION_LIMIT,
    use_redis: env.USE_REDIS,
    retry_limit: env.REDIS_RETRY_LIMIT,
  },
  token: {
    access_token_secret: env.ACCESS_TOKEN_SECRET,
    access_token_exp_in_min: env.ACCESS_TOKEN_EXP_IN_MIN * 60, // Convert minutes to seconds
    refresh_token_exp_in_min: env.REFRESH_TOKEN_EXP_IN_MIN * 60, // Convert minutes to seconds
    refresh_token_secret: env.REFRESH_TOKEN_SECRET,
  },
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    bucketName: env.AWS_S3_BUCKET_NAME,
    signedUrlExpiry: env.SIGNED_URL_EXPIRE,
  },
  email: {
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    username: env.EMAIL_USERNAME,
    password: env.EMAIL_PASSWORD,
    from: env.EMAIL_FROM,
    provider: env.EMAIL_PROVIDER,
  },
  otp: {
    otp_crypto_secret: env.OTP_CRYPTO_SECRET,
    otp_ttl: env.OTP_TTL,
    cool_down_ttl: env.COOL_DOWN_TTL,
    max_per_hour: env.MAX_PER_HOUR,
    max_attempts: env.MAX_ATTEMPTS,
  },
  queue: {
    url: env.RABBITMQ_URL,
    defaultRetries: env.DEFAULT_RETRIES,
    defaultRetryDelayMs: env.DEFAULT_RETRY_DELAY_MS,
    isDlq: env.IS_DLQ,
  },
};
