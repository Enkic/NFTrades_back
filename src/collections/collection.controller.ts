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
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @Post()
  create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @Get('walletBuyTransactions/:wallet/:limit')
  getWalletBuyTransactions(
    @Request() req,
    @Param('wallet') wallet: string,
    @Param('limit') limit: number,
  ) {
    return this.collectionService.getWalletBuyTransactions(wallet, limit);
  }

  @Get('walletSellTransactions/:wallet/:limit')
  getWalletSellTransactions(
    @Request() req,
    @Param('wallet') wallet: string,
    @Param('limit') limit: number,
  ) {
    return this.collectionService.getWalletSellTransactions(wallet, limit);
  }

  @Get('bySalesCount/:duration')
  findAllBySalesCount(@Request() req, @Param('duration') duration: Duration) {
    return this.collectionService.getTopCollectionsBySalesCount(duration, 10);
  }

  @Get('byAvgPrice/:duration')
  findAllByAvgPrice(@Request() req, @Param('duration') duration: Duration) {
    return this.collectionService.getTopCollectionsByAvgPrice(duration, 10);
  }

  @Get('bySalesVolume/:duration')
  findAllBySalesVolume(@Request() req, @Param('duration') duration: Duration) {
    return this.collectionService.getTopCollectionsBySalesVolume(duration, 10);
  }

  @Get('priceDataPoints/:contract/:duration/:groupPeriod')
  getContractPriceDataPoints(
    @Param('contract') contract: string,
    @Param('duration') duration: Duration,
    @Param('groupPeriod') groupPeriod: GroupPeriod,
  ) {
    return this.collectionService.getContractPriceDataPoints(
      contract,
      duration,
      groupPeriod,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionService.findById(id);
  }
}
