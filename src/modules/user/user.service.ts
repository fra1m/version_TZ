import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@entities/User.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  #validEmailRegex = /^([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)$/;

  async saveUser(user: { user }) {
    const candidate = await this.getUserByName(user.user);

    if (candidate) {
      throw new HttpException(
        'Пользователь существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.userRepository.save(user);
  }

  async saveUserEmail(updateUserDto: UpdateUserDto) {
    const user = await this.getUserByName(updateUserDto.user);
    if (user.email) {
      throw new HttpException(
        'У пользователя email существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  async getUserByName(name: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { user: name },
      });
      return user;
    } catch (error) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
  }

  async getUserById(id: number) {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async getAllUserEmail() {
    const users = await this.userRepository.find();
    users.filter((user) => this.#validEmailRegex.test(user.email));
    return users
      .filter((user) => this.#validEmailRegex.test(user.email))
      .map((user) => user.email);
  }
}
