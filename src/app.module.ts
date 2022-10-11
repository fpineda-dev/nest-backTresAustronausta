import { Module } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    // Conected to database
    MongooseModule.forRoot('mongodb://192.168.56.5:27017/nestApiDb'),
    ProductsModule,
    CommonModule,
  ],
})
export class AppModule {}
