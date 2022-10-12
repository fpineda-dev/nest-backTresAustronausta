/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';

@Injectable()
export class UsersService {
  // Creamos nuestra inyeccion de dependencia
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    createUserDto.name = createUserDto.name.toLocaleLowerCase();
    // Encryp user password
    const encryptedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      const user = await this.userModel.create({
        name: createUserDto.name,
        email: createUserDto.email,
        password: encryptedPassword,
        token: createUserDto.token,
      });
      return user;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(term: string) {
    let user: User;

    if (!isNaN(+term)) {
      user = await this.userModel.findOne({ name: term });
    }
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async signinLocal(email: string, password: string) {
    let user;
    if (email !== '') {
      user = await this.userModel.findOne({ email });
    }
    if (!user) throw new UnauthorizedException(`User does not exist`);
    const encryptedPassword = await bcrypt.compare(password, user.password);
    console.log(
      `Check Password ${user.password} ${password} ${encryptedPassword}`,
    );
    if (!encryptedPassword) {
      throw new UnauthorizedException(`Credentials incorrect`);
    }

    return this.singUser(user.id, user.email, 'user');
  }

  signupLocal(dto: AuthDto) {
    return ``;
  }

  singUser(userId: number, email: string, type: string) {
    return this.jwtService.sign({
      sub: userId,
      email: email,
      type: type,
    });
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `User exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create User - Please Check server logs`,
    );
  }
}
