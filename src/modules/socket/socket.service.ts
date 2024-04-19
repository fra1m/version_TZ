import { Injectable } from '@nestjs/common';
import { RedisService } from '@modules/redis/redis.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { CryptoService } from '@modules/crypto/crypto.service';

@Injectable()
export class SocketService {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
  ) {}

  #host = this.configService.get('API_HOST');
  #port = this.configService.get('API_PORT');

  async saveSocketUser(socketId: string, user: string) {
    try {
      await this.redisService.setCacheUser(socketId, user);
      const candidateObservable = await this.httpService.get(
        `${this.#host}${this.#port}/user?user=${user}`,
      );
      const candidate = (await lastValueFrom(candidateObservable)).data;
      if (candidate) {
        const price = await this.cryptoService.getBTC();

        return `Цена BTC: ${price?.priceUSD}`;
      } else {
        const newUserObservable = await this.httpService.post(
          `${this.#host}${this.#port}/user?user=${user}`,
        );

        const newUser = (await lastValueFrom(newUserObservable)).data;
        return `Пользователь: ${newUser?.user} сохранен`;
      }
    } catch (error) {
      return error.message;
    }
  }

  async removeRedis(sessionId: string) {
    return await this.redisService.removeCache(sessionId);
  }

  async saveSocketId(key: string, body = 'session') {
    await this.cryptoService.putBTCPrice();
    return await this.redisService.setCacheSocketId(key, body);
  }
}
