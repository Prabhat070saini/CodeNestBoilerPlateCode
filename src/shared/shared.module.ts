import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
// import { CacheModule, CacheProvider } from '@prabhat7saini/cache';

import { config } from 'src/config/config';
// import { PermissionModule } from '@prabhat7saini/guards';
import { exception } from 'src/common/constants/exception';
// import { FileModule, StorageProviderType } from '@prabhat7saini/filesystem';
// import { EmailModule, EmailProviderType } from '@prabhat7saini/email';
import { RedisModule } from './cache/redis/redis.module';

// const redisModule = CacheModule.register(CacheProvider.REDIS, {
//   host: config.redis.host,
//   port: config.redis.port,
//   password: config.redis.password,
//   db: 0,
// });

// JWT
// const jwtModule = JwtTokenModule.register({
//   access: {
//     secret: config.token.access_token_secret,
//     expiresIn: config.token.access_token_exp_in_min,
//   },
//   // refresh: { secret: process.env.REFRESH_SECRET || 'REFRESH_SECRET_KEY', expiresIn: '7d' },
// });
// // for the use of the permissonModule need first inject userroles array in request?.user?.roles;

// const rolePermission = PermissionModule.register({
//   errorCode: exception.PROTECTED_ROUTE.code,
//   errorMessage: exception.PROTECTED_ROUTE.message,
// });

// email
// const email = EmailModule.register(EmailProviderType.SMTP, {
//   host: config.email.host!,
//   port: config.email.port,
//   username: config.email.username,
//   password: config.email.password,
//   from: config.email.from,
// });

// file system

// const fileSystem = FileModule.register(StorageProviderType.S3, {
//   region: config.aws.region,
//   accessKeyId: config.aws.accessKeyId,
//   secretAccessKey: config.aws.secretAccessKey!,
//   bucketName: config.aws.bucketName,
//   signedUrlExpiry: config.aws.signedUrlExpiry,
// });
@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    // HttpModule,
    // LoggerModule.forRoot({ level: config.log_level }),
    // redisModule,
    // jwtModule,
    // email,
    // rolePermission,
    // fileSystem,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedModule {}
