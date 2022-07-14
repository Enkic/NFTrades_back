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
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('collections')
export class WalletController {
  constructor(private readonly collectionService: WalletService) {}
}
