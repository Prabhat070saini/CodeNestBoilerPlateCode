import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { config } from './config/config';
import { CustomLoggerService } from './common/lib/logger/custom.logger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  /* This tells NestJS to use the global validation pipe for all requests*/
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );

  /*This tells NestJS to listen for process termination signals*/
  app.enableShutdownHooks();

  /*This tells NestJS to allow cross-origin requests*/
  app.enableCors({ origin: '*' });

  /*This tells NestJS to set the global prefix to /api/*/
  app.setGlobalPrefix('api/');

  /*This tells NestJS to set the versioning to URI*/
  app.enableVersioning({ type: VersioningType.URI });

  /*This tells NestJS to use the custom logger*/
  app.useLogger(app.get(CustomLoggerService));
  await app.listen(config.app.port);
}
bootstrap();
