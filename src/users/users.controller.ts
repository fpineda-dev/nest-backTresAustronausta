/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  // private readonly authService: AuthService,

  @ApiResponse({ status: 201, description: 'user was created', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':email/:password')
  @ApiResponse({
    status: 200,
    description: 'The user was logged in',
    type: User,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  signinLocal(
    @Param('email') email: string,
    @Param('password') password: string,
  ) {
    return this.usersService.signinLocal(email, password);
  }
  /*
  @Post()
  signupLocal(@Body() dto: AuthDto) {
    return this.usersService.signupLocal(dto);
  }*/
}
