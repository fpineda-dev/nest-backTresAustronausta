/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Product extends Document {
  @ApiProperty({
    example: 'T-Shirt Space X',
    description: 'Product Name',
    uniqueItems: true,
  })
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @ApiProperty({
    example: 0,
    description: 'Product Price',
  })
  
  price: number;

  @Prop({
    index: true,
  })
  productManage: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
