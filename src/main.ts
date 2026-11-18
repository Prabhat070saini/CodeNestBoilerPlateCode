import { NestFactory } from '@nestjs/core';
import { NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { config } from './config/config';

import { CustomLoggerService } from './common/lib/logger/custom.logger';
import { createFastifyAdapter } from './common/Interceptor';
import { registerCookiePlugin } from './common/Interceptor/plugins';
import { configureApplication } from './bootstrap/application.bootstrap';
import { configureSwagger } from './bootstrap/swagger.bootstrap';

async function bootstrap(): Promise<void> {
  // 1. Create  adapter
  const adapter = await createFastifyAdapter();

  // 2. Create NestJS application
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
    {
      bufferLogs: true,
    },
  );

  // 3. Initialize application logger
  app.useLogger(app.get(CustomLoggerService));

  // 4. Register cookies
  await registerCookiePlugin(app);

  // 5. Configure application
  configureApplication(app);

  // 6. Configure Swagger
  configureSwagger(app);

  // 7. Start HTTP server
  await app.listen(config.app.port, '0.0.0.0');
  /*eslint-disable */
  // console.log({
  //   message: 'Application started successfully',
  //   port: config.app.port,
  //   environment: config.env,
  //   swagger: `http://localhost:${config.app.port}/docs`,
  // });
}
bootstrap().catch((error: unknown) => {
  console.error('Application startup failed:', error);
  process.exit(1);
});
/*eslint-enable */
