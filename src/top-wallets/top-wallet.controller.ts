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
import { TopWalletService } from './top-wallet.service';
import { CreateTopWalletDto } from './dto/create-top-wallet.dto';
import { UpdateTopWalletDto } from './dto/update-top-wallet.dto';

@Controller('top-wallets')
export class TopWalletController {
  constructor(private readonly topWalletService: TopWalletService) {}

  @Post()
  create(@Body() createTopWalletDto: CreateTopWalletDto) {
    return this.topWalletService.create(createTopWalletDto);
  }

  @Get('')
  findAll() {
    return this.topWalletService.findAll();
  }

  @Get('updateDb')
  updateDb(@Request() req) {
    return this.topWalletService.updateDb();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.topWalletService.findById(id);
  }
}
