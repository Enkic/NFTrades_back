import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { Wallet } from 'src/wallets/schema/wallet.schema';
import { Contract } from 'src/contracts/schema/contract.schema';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: false,
    default: -1,
  })
  alchemyTransfersWebhookId: number;

  @Prop({
    required: false,
    default: -1,
  })
  alchemyMinedTransfersWebhookId: number;

  @Prop({
    required: false,
    default: 0,
  })
  alchemyWebhookCount: number;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Contract.name }],
    required: false,
    default: [],
  })
  contractsToFollow: Contract[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Wallet.name,
    required: false,
  })
  wallet: Wallet;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Wallet.name }],
    required: false,
    default: [],
  })
  walletsToFollow: Wallet[];
}

export const UserSchema = SchemaFactory.createForClass(User);
