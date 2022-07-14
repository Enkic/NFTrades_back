import { Module } from '@nestjs/common';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './schema/collection.schema';
import { MnemonichqModule } from 'src/mnemonichq/mnemonichq.module';
import { AlchemyModule } from 'src/alchemy/alchemy.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Collection.name, schema: CollectionSchema },
    ]),
    MnemonichqModule,
    AlchemyModule,
  ],
  controllers: [CollectionController],
  providers: [CollectionService],
  exports: [CollectionService],
})
export class CollectionModule {}
