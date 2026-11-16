import * as dotenv from 'dotenv';
import * as path from 'path';
import { envSchema } from './schema.config';

// Explicitly load .env from project root
dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
});

const { error, value } = envSchema.validate(process.env, {
  abortEarly: false,
  allowUnknown: true,
  convert: true,
});

if (error) {
  throw new Error(
    `Environment validation failed:\n${error.details
      .map((detail) => detail.message)
      .join('\n')}`,
  );
}

export const env = value;
