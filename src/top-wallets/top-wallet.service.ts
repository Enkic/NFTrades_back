import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Duration } from 'src/core/common/common.types';
import { CreateTopWalletDto } from './dto/create-top-wallet.dto';
import { UpdateTopWalletDto } from './dto/update-top-wallet.dto';
import { TopWallet, TopWalletDocument } from './schema/top-wallet.schema';
import { MnemonichqService } from 'src/mnemonichq/mnemonichq.service';
import { AlchemyService } from 'src/alchemy/alchemy.service';

@Injectable()
export class TopWalletService {
  constructor(
    @InjectModel(TopWallet.name)
    private topWalletsModel: Model<TopWalletDocument>,
    private mnemonichqService: MnemonichqService,
    private alchemyService: AlchemyService,
  ) {}
  create(createTopWalletDto: CreateTopWalletDto): Promise<TopWalletDocument> {
    return this.topWalletsModel.create(createTopWalletDto);
  }

  async findAll(): Promise<TopWalletDocument[]> {
    return await this.topWalletsModel
      .find()
      .sort('profitabilityOneMonth')
      .exec();
  }

  // @Cron
  async updateDb() {
    const collections =
      await this.mnemonichqService.getTopCollectionsBySalesVolume(
        Duration.ONE_MONTH,
        4, // changer quand la fonction sera OK
      );
    const walletsRentabilities = [];
    for (const collection of collections) {
      //tmp
      const collectionOwners = await this.alchemyService.getOwnersOfContract(
        collection.contractAddress,
        5,
      );
      //tmp
      const walletsFetched = [];
      for (const ownerAddresse of collectionOwners) {
        if (walletsFetched.indexOf(ownerAddresse) > -1) {
          continue;
        }
        walletsFetched.push(ownerAddresse);
        const walletProfitability =
          await this.mnemonichqService.getWalletRentability(ownerAddresse);
        if (walletProfitability) {
          const walletDto = {
            address: ownerAddresse,
            profitabilityThreeMonth:
              walletProfitability.profitabilityThreeMonth,
            profitabilityOneMonth: walletProfitability.profitabilityOneMonth,
            profitabilityOneWeek: walletProfitability.profitabilityOneWeek,
            totalLossThreeMonth: walletProfitability.totalLossThreeMonth,
            totalLossOneMonth: walletProfitability.totalLossOneMonth,
            totalLossOneWeek: walletProfitability.totalLossOneWeek,
            totalGainThreeMonth: walletProfitability.totalGainThreeMonth,
            totalGainOneMonth: walletProfitability.totalGainOneMonth,
            totalGainOneWeek: walletProfitability.totalGainOneWeek,
          };
          if (
            walletProfitability.profitabilityThreeMonth > 0.5 ||
            walletProfitability.profitabilityOneMonth > 0.5 ||
            walletProfitability.profitabilityOneWeek > 0.5
          ) {
            await this.topWalletsModel.findOneAndUpdate(
              { address: ownerAddresse },
              walletDto,
              {
                new: true,
                upsert: true,
              },
            );
          }
        }
      }
    }
    return walletsRentabilities;
  }

  findById(id: string): Promise<TopWalletDocument | null> {
    return this.topWalletsModel.findById(id).populate('structure').exec();
  }
}
