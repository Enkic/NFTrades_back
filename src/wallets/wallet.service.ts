import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet, WalletDocument } from './schema/wallet.schema';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name)
    private collectionModel: Model<WalletDocument>,
  ) {}
  create(createWalletDto: CreateWalletDto): Promise<WalletDocument> {
    return this.collectionModel.create(createWalletDto);
  }

  findAll(): Promise<WalletDocument[]> {
    return this.collectionModel.find({}).exec();
  }

  findById(id: string): Promise<WalletDocument | null> {
    return this.collectionModel.findById(id).exec();
  }
}
