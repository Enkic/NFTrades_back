import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { CollectionFilterType } from 'src/core/collection/collection.types';

export type CollectionDocument = Collection & Document;

@Schema({
  collection: 'collections',
  timestamps: true,
})
export class Collection {
  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  filterType: CollectionFilterType;
}

export const CollectionSchema = SchemaFactory.createForClass(Collection);
