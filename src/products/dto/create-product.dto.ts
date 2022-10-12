/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    default: 'T-Shirt Space X',
    description: 'Product Name',
  })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({
    default: 1,
    description: 'Product Price',
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  price: number;
  productManage: string;
}
