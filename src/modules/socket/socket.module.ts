import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { RedisModule } from '@modules/redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { CryptoModule } from '@modules/crypto/crypto.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [RedisModule, HttpModule, CryptoModule, UserModule],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
