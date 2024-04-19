import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async getCache(key: string) {
    return await this.cache.get(key);
  }

  async isSocketIdInCache(socketId: string): Promise<boolean> {
    const exists = await this.cache.get(socketId);
    return exists === 'session';
  }

  async setCacheUser(socketId: string, user: string) {
    const cacheCheckResult = await this.isSocketIdInCache(socketId);
    const cachedUser = await this.cache.get(socketId);

    if (cacheCheckResult) {
      await this.cache.set(socketId, user);
      return 'Пользователь с указанным уникальным индификатором сохранен';
    } else {
      if (cachedUser !== user) {
        throw new HttpException(
          'Пользователь уже передал уникальным индификатор',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async removeCache(socketId: string) {
    const user = await this.getCache(socketId);
    if (!user) {
      return 'Пользователь с указанным уникальным индификатором не найден';
    }
    await this.cache.del(socketId);
    return 'Соединение разорвано';
  }

  async setCacheSocketId(socketId: string, session: string) {
    const cacheCheckResult = await this.isSocketIdInCache(socketId);

    if (cacheCheckResult) {
      return 'Сокет должен быть уникальным';
    }
    await this.cache.set(socketId, session);
    return 'Сокет сохранен';
  }
}
