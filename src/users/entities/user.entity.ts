/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @ApiProperty({
    example: 'Morgan Freedman',
    description: 'Name User',
    uniqueItems: true,
  })
  @Prop({
    unique: true,
    index: true,
  })
  name: string;

  @ApiProperty({
    example: 'mfreedman@start.com',
    description: 'email address user',
    uniqueItems: true,
  })
  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @ApiProperty({
    example: 'cualquiera',
    description: 'the password of user',
    uniqueItems: true,
  })
  @Prop({
    unique: true,
    index: true,
  })
  password: string;
  
  token: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
