import { Controller, Get, Post, Body, Patch, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@entities/User.entity';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Получение пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Get()
  getUser(@Query('user') user: string) {
    return this.userService.getUserByName(user);
  }

  @ApiOperation({ summary: 'Сохранение пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Post()
  saveUser(@Query('user') user: string) {
    return this.userService.saveUser({ user });
  }

  @ApiOperation({ summary: 'Сохранение почты пользователя' })
  @ApiResponse({ status: 200, type: UserEntity })
  @Patch('/email')
  saveEmail(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.saveUserEmail(updateUserDto);
  }
}
