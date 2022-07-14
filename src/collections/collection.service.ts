import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { Collection, CollectionDocument } from './schema/collection.schema';
import { MnemonichqService } from 'src/mnemonichq/mnemonichq.service';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { Duration, GroupPeriod } from 'src/core/common/common.types';

@Injectable()
export class CollectionService {
  constructor(
    @InjectModel(Collection.name)
    private collectionModel: Model<CollectionDocument>,
    private mnemonichqService: MnemonichqService,
    private alchemyService: AlchemyService,
  ) {}
  create(
    createCollectionDto: CreateCollectionDto,
  ): Promise<CollectionDocument> {
    return this.collectionModel.create(createCollectionDto);
  }

  getWalletBuyTransactions(wallet: string, limit: number) {
    return this.mnemonichqService.getWalletBuyTransactions(wallet, limit);
  }

  getWalletSellTransactions(wallet: string, limit: number) {
    return this.mnemonichqService.getWalletSellTransactions(wallet, limit);
  }

  getTopCollectionsBySalesCount(
    duration: Duration,
    limit: number,
  ): Promise<CollectionDocument[]> {
    return this.mnemonichqService.getTopCollectionsBySalesCount(
      duration,
      limit,
    );
  }

  getTopCollectionsByAvgPrice(
    duration: Duration,
    limit: number,
  ): Promise<CollectionDocument[]> {
    return this.mnemonichqService.getTopCollectionsByAvgPrice(duration, limit);
  }

  getContractPriceDataPoints(
    contract: string,
    duration: Duration,
    groupPeriod: GroupPeriod,
  ): Promise<CollectionDocument[]> {
    return this.mnemonichqService.getContractPriceDataPoints(
      contract,
      duration,
      groupPeriod,
    );
  }

  getTopCollectionsBySalesVolume(
    duration: Duration,
    limit: number,
  ): Promise<CollectionDocument[]> {
    return this.mnemonichqService.getTopCollectionsBySalesVolume(
      duration,
      limit,
    );
  }

  findAll(): Promise<CollectionDocument[]> {
    return this.collectionModel.find({}).populate('structure').exec();
  }

  findById(id: string): Promise<CollectionDocument | null> {
    return this.collectionModel.findById(id).populate('structure').exec();
  }
}
