import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type ContractDocument = Contract & Document;

@Schema({
  collection: 'collections',
  timestamps: true,
})
export class Contract {
  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: false,
  })
  avgPriceMaxAlert: number;

  @Prop({
    required: false,
  })
  avgPriceMinAlert: number;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
