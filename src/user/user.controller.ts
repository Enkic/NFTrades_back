import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { Duration, GroupPeriod } from 'src/core/common/common.types';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('updatePersonalWallet/:userId')
  updatePersonalWallet(@Body() body: any, @Param('userId') userId: string) {
    return this.userService.updatePersonalWallet(userId, body.walletAddress);
  }

  @Post('addWalletAlert/:userId')
  addWalletAlertToFollow(@Body() body: any, @Param('userId') userId: string) {
    return this.userService.addWalletAlertToFollow(userId, body.walletAddress);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
