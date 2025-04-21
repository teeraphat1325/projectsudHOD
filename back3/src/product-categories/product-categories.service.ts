import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductCategoryDto } from './dto/create-product-category.dto';
import { UpdateProductCategoryDto } from './dto/update-product-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductCategory } from './entities/product-category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductCategoriesService {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly productCategories: Repository<ProductCategory>,
  ) {}
  create(createProductCategoryDto: CreateProductCategoryDto) {
    return this.productCategories.save(createProductCategoryDto);
  }

  findAll() {
    return this.productCategories.find();
  }

  findOne(id: number) {
    return this.productCategories.findOneBy({ id });
  }

  update(id: number, updateProductCategoryDto: UpdateProductCategoryDto) {
    return this.productCategories.update(id, updateProductCategoryDto);
  }
  async remove(id: number): Promise<void> {
    const productCategory = await this.productCategories.findOneBy({ id });
    if (!productCategory) {
      throw new NotFoundException(`ProductCategory with ID ${id} not found`);
    }
    await this.productCategories.softRemove(productCategory);
  }
}
