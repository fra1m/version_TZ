import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'Антон', description: 'Пользователь' })
  @IsString({ message: 'Должно быть строкой' })
  user: string;

  @ApiProperty({ example: 'user@user.ru', description: 'Почта пользователя' })
  @IsString({ message: 'Должно быть строкой' })
  @IsEmail({}, { message: 'Не корректный email' })
  email: string;
}
