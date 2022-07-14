import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { WalletType } from 'src/core/wallet/wallet.types';

export type WalletDocument = Wallet & Document;

@Schema({
  collection: 'collections',
  timestamps: true,
})
export class Wallet {
  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: false,
  })
  name: string;

  @Prop({
    required: true,
  })
  type: WalletType;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
