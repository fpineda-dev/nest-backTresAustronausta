/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto, email: string) {
    createProductDto.name = createProductDto.name.toLocaleLowerCase();

    try {
      const product = await this.productModel.create({
        name: createProductDto.name,
        price: createProductDto.price,
        productManage: email,
      });
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(email: string) {
    const owner = { productManage: email };
    const products = await this.productModel.find(owner);
    return products;
  }

  async findOne(term: string) {
    let product: Product;

    if (!isNaN(+term)) {
      product = await this.productModel.findOne({ price: term });
    }

    //MongoID
    if (!product && isValidObjectId(term)) {
      product = await this.productModel.findById(term);
    }

    //Name
    if (!product) {
      product = await this.productModel.findOne({
        name: term.toLocaleLowerCase().trim(),
      });
    }

    //Product Manager
    if (!product) {
      product = await this.productModel.findOne({
        productManage: term.toLocaleLowerCase().trim(),
      });
    }

    if (!product)
      throw new NotFoundException(
        `The product with this param '${term}' not found`,
      );

    return product;
  }

  async update(term: string, updateProductDto: UpdateProductDto, email: string) {
    const product = await this.findOne(term);
    if (product.productManage === email) {
    updateProductDto.name = updateProductDto.name.toLocaleLowerCase();
    if (updateProductDto.name) {
      try { 
        await product.updateOne(updateProductDto);
        return { ...product.toJSON(), ...updateProductDto };
      } catch (error) {
        this.handleExceptions(error);
      }
      return product;
    } // End validate model
  } else {
    throw new UnauthorizedException(`Unauthorized to edit current product`)
  }// End else validation if mail addrees is equal

  }

  async remove(id: string, email: string) {
    const product = await this.findOne(id);
    if (product.productManage === email) {
    const { deletedCount } = await this.productModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Product with id '${id}' not found`);
    return deletedCount;

  } else {
    throw new UnauthorizedException(`Unauthorized to delete current product`)
  }// End else validation if mail addrees is equal


  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Product exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create Product - Please Check server logs`,
    );
  }
}
