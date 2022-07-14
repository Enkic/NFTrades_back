import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { MnemonichqModule } from 'src/mnemonichq/mnemonichq.module';
import { AlchemyModule } from 'src/alchemy/alchemy.module';
import { WalletModule } from 'src/wallets/wallet.module';
import { ContractModule } from 'src/contracts/contract.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AlchemyModule,
    MnemonichqModule,
    WalletModule,
    ContractModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
