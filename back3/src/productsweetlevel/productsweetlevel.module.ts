import { Module } from '@nestjs/common';
import { ProductsweetlevelService } from './productsweetlevel.service';
import { ProductsweetlevelController } from './productsweetlevel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Productsweetlevel } from './entities/productsweetlevel.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Productsweetlevel, Product])],
  controllers: [ProductsweetlevelController],
  providers: [ProductsweetlevelService],
})
export class ProductsweetlevelModule {}
