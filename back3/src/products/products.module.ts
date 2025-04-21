import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Type } from 'src/types/entities/type.entity';
import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { Productsize } from 'src/productsize/entities/productsize.entity';
import { Productsweetlevel } from 'src/productsweetlevel/entities/productsweetlevel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Type,
      ProductCategory,
      Productsize,
      Productsweetlevel,
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
