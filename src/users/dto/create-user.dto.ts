import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    default: 'Morgan Freedman',
    description: 'Name User',
  })
  @MinLength(1)
  @IsString()
  name: string;

  @ApiProperty({
    default: 'mfreedman@start.com',
    description: 'email address user',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'cualquiera',
    description: 'the password of user',
  })
  @MinLength(1)
  password: string;
  @MinLength(1)
  token: string;
}
