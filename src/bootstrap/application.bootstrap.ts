import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';

export function configureApplication(app: INestApplication): void {
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      enableDebugMessages: true,
    }),
  );

  app.enableShutdownHooks();
}
