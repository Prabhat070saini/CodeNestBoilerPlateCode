import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { config } from '../config/config';
import { xApiKeyHeader } from '../common/constants/app.constant';

export function configureSwagger(app: INestApplication): void {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Boilerplate API')
    .setDescription('The Boilerplate API description')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: xApiKeyHeader,
        in: 'header',
      },
      xApiKeyHeader,
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .addServer(`http://localhost:${config.app.port}`, 'Local Environment')
    .addServer('https://api.dev.example.com', 'Development Environment')
    .addServer('https://api.prod.example.com', 'Production Environment')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
