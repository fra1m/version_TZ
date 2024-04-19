import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Антон/123/Антон1',
    description: 'ID пользователя из WS',
  })
  @Column({ nullable: false })
  user: string;

  @ApiProperty({ example: 'user@user.ru', description: 'Почта пользователя' })
  @Column({ unique: false, nullable: true })
  email: string;
}
