import { NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';

export async function registerCookiePlugin(
  app: NestFastifyApplication,
): Promise<void> {
  await app.register(fastifyCookie);
}
