import { CryptoEntity } from '@entities/Crypto.entity';
import { SendMailService } from '@modules/sendMail/sendMail.service';
import { UserService } from '@modules/user/user.service';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';

@Injectable()
export class CryptoService {
  constructor(
    @InjectRepository(CryptoEntity)
    private cryptoRepository: Repository<CryptoEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly sendMailService: SendMailService,
    private readonly userService: UserService,
  ) {}

  #crypto_api_key = this.configService.get('CRYPTO_API_KEY');
  private readonly logger = new Logger(CryptoService.name);

  async putBTCPrice() {
    const BTC = await this.getBTC();
    if (!BTC) {
      const priceBTCinUSD = await this.CryptoGetBTC();
      await this.cryptoRepository.save({
        nameCrypto: 'BTC',
        priceUSD: +priceBTCinUSD.USD,
      });
      this.logger.log(`BTC: ${priceBTCinUSD.USD} в USD, сохранен`);
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async updateBTCPrice() {
    const BTC = await this.getBTC();
    const CryptoBTCPrice = await this.CryptoGetBTC();
    if (BTC) {
      const down = (Math.floor(BTC.priceUSD) - 100) % 100;
      const up = 100 - down;
      if (
        Math.floor(BTC.priceUSD) + up < Math.floor(CryptoBTCPrice.USD) ||
        Math.floor(BTC.priceUSD) - down > Math.floor(CryptoBTCPrice.USD)
      ) {
        Object.assign(BTC, { priceUSD: CryptoBTCPrice.USD });

        const updatedPrice = await this.cryptoRepository.save(BTC);

        const usersEmail = await this.userService.getAllUserEmail();

        if (usersEmail.length) {
          await this.sendMailService.sendBTConEmail({
            recipients: usersEmail,
            subject: 'Test',
            text: `BTC: ${updatedPrice.priceUSD}`,
          });
        }

        this.logger.log(`BTC: ${updatedPrice.priceUSD} в USD, обнавлен`);
      } else {
        this.logger.log(`BTC: ${CryptoBTCPrice.USD} в USD`);
      }
    } else {
      await this.putBTCPrice();
    }
  }

  async CryptoGetBTC() {
    const res = await this.httpService.get(
      `https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD&api_key=${
        this.#crypto_api_key
      }`,
    );
    const priceBTCinUSD = (await lastValueFrom(res)).data;
    return priceBTCinUSD;
  }

  async getBTC() {
    const BTC = await this.cryptoRepository.findOne({
      where: { nameCrypto: 'BTC' },
    });
    return BTC;
  }
}
