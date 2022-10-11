import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  price: number;

  @Prop({
    unique: true,
    index: true,
  })
  productManage: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
