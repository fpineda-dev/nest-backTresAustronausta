import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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

  async create(createProductDto: CreateProductDto) {
    createProductDto.name = createProductDto.name.toLocaleLowerCase();

    try {
      const product = await this.productModel.create(createProductDto);
      return product;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    const products = await this.productModel.find();
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

  async update(term: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(term);
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
  }

  async remove(id: string) {
    /*const product = await this.findOne(id);
    await product.deleteOne();*/
    // const result = await this.productModel.findByIdAndDelete(id);
    const { deletedCount } = await this.productModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`Product with id '${id}' not found`);
    return deletedCount;
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
function _id(_id: any, id: string) {
  throw new Error('Function not implemented.');
}
