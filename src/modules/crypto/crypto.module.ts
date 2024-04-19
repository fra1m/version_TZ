import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CryptoEntity } from '@entities/Crypto.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { CryptoService } from './crypto.service';
import { SendMailModule } from '@modules/sendMail/sendMail.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([CryptoEntity]), // Регистрируем CryptoEntity в TypeOrmModule
    ScheduleModule.forRoot(),
    SendMailModule,
    UserModule,
  ],
  providers: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
