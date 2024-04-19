import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  WsResponse,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server } from 'socket.io';
import { Logger, OnModuleInit, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { Socket } from 'socket.io-client';

@WebSocketGateway()
export class SocketGateway implements OnModuleInit {
  constructor(private readonly socketService: SocketService) {}

  private readonly logger = new Logger(SocketService.name);

  @WebSocketServer()
  server: Server;

  @UseInterceptors(CacheInterceptor)
  onModuleInit() {
    this.server.on('connection', async (socket) => {
      const data = await this.socketService.saveSocketId(socket.id);
      // FIXME: Информацию о айди сокета в логер Redis
      this.logger.log(`${data}. Сесия: ${socket.id}`);
    });
  }

  // @UseInterceptors(CacheInterceptor)
  async handleDisconnect(session: Socket) {
    const data = await this.socketService.removeRedis(session.id);
    // FIXME: Информацию о айди сокета в логер Redis
    // TODO: ДОбавить если id уже есть в кэше, то тогда цену битка передаем в сессию

    this.logger.log(`${data}. Сесия: ${session.id} - удалена`);
  }

  @UseInterceptors(CacheInterceptor)
  @SubscribeMessage('createUserCon')
  async saveRedisUser(
    @MessageBody() user: any,
    @ConnectedSocket() socket: Socket,
  ): Promise<WsResponse<any>> {
    const data = await this.socketService.saveSocketUser(socket.id, user);
    return {
      event: 'server',
      data: data,
    };
  }
}
