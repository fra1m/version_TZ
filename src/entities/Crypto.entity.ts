import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'crypto' })
export class CryptoEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'BTC', description: 'Наименование крипты' })
  @Column({ nullable: false })
  nameCrypto: string;

  @ApiProperty({ example: '432.23', description: 'Цена крипты в USD' })
  @Column('decimal', { unique: false, nullable: true, precision: 10, scale: 2 })
  priceUSD: number;
}
