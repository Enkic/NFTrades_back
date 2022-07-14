import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type TopWalletDocument = TopWallet & Document;

@Schema({
  collection: 'top-wallets',
  timestamps: true,
})
export class TopWallet {
  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
  })
  profitabilityThreeMonth: number;

  @Prop({
    required: true,
  })
  profitabilityOneMonth: number;

  @Prop({
    required: true,
  })
  profitabilityOneWeek: number;

  @Prop({
    required: true,
  })
  totalLossThreeMonth: number;

  @Prop({
    required: true,
  })
  totalLossOneMonth: number;

  @Prop({
    required: true,
  })
  totalLossOneWeek: number;

  @Prop({
    required: true,
  })
  totalGainThreeMonth: number;

  @Prop({
    required: true,
  })
  totalGainOneMonth: number;

  @Prop({
    required: true,
  })
  totalGainOneWeek: number;
}

export const TopWalletSchema = SchemaFactory.createForClass(TopWallet);
