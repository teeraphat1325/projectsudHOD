import { Module } from '@nestjs/common';
import { ProductsizeService } from './productsize.service';
import { ProductsizeController } from './productsize.controller';
import { Productsize } from './entities/productsize.entity';
import { Product } from 'src/products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Productsize, Product])],
  controllers: [ProductsizeController],
  providers: [ProductsizeService],
})
export class ProductsizeModule {}
