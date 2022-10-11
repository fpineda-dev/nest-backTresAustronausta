import { IsInt, IsPositive, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1)
  name: string;
  @IsInt()
  @IsPositive()
  @Min(1)
  price: number;
  @IsString()
  @MinLength(1)
  productManage: string;
}
