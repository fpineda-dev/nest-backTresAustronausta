/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { AuthGuard } from '@nestjs/passport';
import { GetCurrentUserByEmail } from 'src/users/util/get-user-by-emaul.decorator';
import { JwtAuthGuard } from 'src/users/util/guards/JwtGuard.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: 201, description: 'Product was created', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  create(@Body() createProductDto: CreateProductDto, @GetCurrentUserByEmail() email: string) {
    return this.productsService.create(createProductDto, email);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Products was found',
    type: Product,
  })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  findAll(@GetCurrentUserByEmail() email: string) {
    console.log('findAll controller', email);
    return this.productsService.findAll(email);
  } 

  @UseGuards(JwtAuthGuard)
  @Patch(':term')
  @ApiResponse({ status: 200, description: 'Product was updated', type: Product })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  update(
    @Param('term') term: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetCurrentUserByEmail() email: string,
  ) {
    return this.productsService.update(term, updateProductDto, email);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiResponse({ status: 201, description: 'Product was deleted', type: Product })  
  @ApiResponse({ status: 403, description: 'Unauthorized' })
  remove(@Param('id', ParseMongoIdPipe) id: string, @GetCurrentUserByEmail() email: string) {
    return this.productsService.remove(id, email);
  }
}
