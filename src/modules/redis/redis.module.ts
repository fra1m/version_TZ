import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          url: configService.get('REDIS_URL'),
          // TODO: ttl: configService.get('CACHE_TTL'),
        }),
      }),
    }),
    UserModule,
  ],
  controllers: [],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
