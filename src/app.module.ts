import { SocketModule } from '@modules/socket/socket.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@modules/redis/redis.module';
import { UserModule } from '@modules/user/user.module';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { CryptoModule } from '@modules/crypto/crypto.module';
import { SendMailModule } from '@modules/sendMail/sendMail.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: false,
        logging: true,
      }),
    }),
    SendMailModule,
    CryptoModule,
    HttpModule,
    SocketModule,
    RedisModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
