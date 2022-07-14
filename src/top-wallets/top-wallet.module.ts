import { Module } from '@nestjs/common';
import { TopWalletService } from './top-wallet.service';
import { TopWalletController } from './top-wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TopWallet, TopWalletSchema } from './schema/top-wallet.schema';
import { MnemonichqModule } from 'src/mnemonichq/mnemonichq.module';
import { AlchemyModule } from 'src/alchemy/alchemy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TopWallet.name, schema: TopWalletSchema },
    ]),
    MnemonichqModule,
    AlchemyModule,
  ],
  controllers: [TopWalletController],
  providers: [TopWalletService],
  exports: [TopWalletService],
})
export class TopWalletModule {}
