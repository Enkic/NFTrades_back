import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contract, ContractSchema } from './schema/contract.schema';
import { MnemonichqModule } from 'src/mnemonichq/mnemonichq.module';
import { AlchemyModule } from 'src/alchemy/alchemy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
    ]),
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService],
})
export class ContractModule {}
