import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schema/user.schema';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { WalletService } from 'src/wallets/wallet.service';
import { WalletType } from 'src/core/wallet/wallet.types';
import { Contract } from 'src/contracts/schema/contract.schema';
import { MnemonichqService } from 'src/mnemonichq/mnemonichq.service';
import { Duration, GroupPeriod } from 'src/core/common/common.types';
import { ContractService } from 'src/contracts/contract.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private alchemyService: AlchemyService,
    private mnemonichqService: MnemonichqService,
    private walletService: WalletService,
    private contractService: ContractService,
  ) {}

  create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return this.userModel.create(createUserDto);
  }

  // Alchemy webhook route
  async alchemyNewTransaction(transaction: string, userId: string) {
    const user = await this.userModel.findOne({ userId: userId });
    user.alchemyWebhookCount++;
    user.save();
    // Send a notification to user
    console.log(transaction);
    console.log(userId);
  }

  async updatePersonalWallet(userId: string, walletAddress: string) {
    const wallet = await this.walletService.create({
      address: walletAddress,
      type: WalletType.BELONG_TO_USER,
    });
    return await this.userModel.findOneAndUpdate(
      { userId: userId },
      { wallet: wallet._id },
    );
  }

  async addWalletAlertToFollow(userId: string, walletAddress) {
    const user = await this.userModel.findOne({ userId: userId });
    if (user && user.walletsToFollow.length === 0) {
      const [alchemyTransfersWebhookId, alchemyMinedTransfersWebhookId] =
        await this.alchemyService.createTransferWebhook(
          walletAddress,
          user.userId,
        );
      if (alchemyTransfersWebhookId && alchemyMinedTransfersWebhookId) {
        user.alchemyTransfersWebhookId = alchemyTransfersWebhookId;
        user.alchemyMinedTransfersWebhookId = alchemyMinedTransfersWebhookId;
        user.save();
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } else if (
      user &&
      user.alchemyTransfersWebhookId &&
      user.alchemyMinedTransfersWebhookId
    ) {
      this.alchemyService.addTransferWebhook(
        walletAddress,
        user.alchemyTransfersWebhookId,
        user.alchemyMinedTransfersWebhookId,
      );
    }
    throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
  }

  async addNewContractToWatch(userId: string, body: any) {
    const contract = await this.contractService.create({
      address: body.address,
      avgPriceMaxAlert: body.avgPriceMaxAlert,
      avgPriceMinAlert: body.avgPriceMinAlert,
    });
    this.userModel.findOneAndUpdate(
      { userId: userId },
      {
        contractsToFollow: {
          $push: {
            contract,
          },
        },
      },
    );
  }

  async removeContractToWatch(userId: string, contractId: string) {
    const contract = await this.contractService.findById(contractId);
    if (contract) {
      this.userModel.findOneAndUpdate(
        { userId: userId },
        {
          contractsToFollow: {
            $pull: {
              contract,
            },
          },
        },
      );
    }
    throw new HttpException('Wrong contract id', HttpStatus.BAD_REQUEST);
  }

  async updateContractToWatch(contract: any) {
    return await this.contractService.update(contract._id, contract);
  }

  // CRON toute les heures
  async watchContractAveragePrices() {
    const users = await this.userModel
      .find()
      .populate('contractsToFollow')
      .exec();
    for (const user of users) {
      if (user.contractsToFollow.length > 0) {
        for (const contract of user.contractsToFollow) {
          const contractAvgPrice =
            await this.mnemonichqService.getContractPriceDataPoints(
              contract.address,
              Duration.ONE_DAY,
              GroupPeriod.GROUP_BY_PERIOD_1_HOUR,
            );
          if (contractAvgPrice > contract.avgPriceMaxAlert) {
            // send notification to user
          } else if (contractAvgPrice < contract.avgPriceMinAlert) {
            // send notification to user
          }
        }
      }
    }
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find({}).populate('structure').exec();
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).populate('structure').exec();
  }
}
