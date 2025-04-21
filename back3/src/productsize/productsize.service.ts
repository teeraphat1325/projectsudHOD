import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsizeDto } from './dto/create-productsize.dto';
import { UpdateProductsizeDto } from './dto/update-productsize.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Productsize } from './entities/productsize.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsizeService {
  constructor(
    @InjectRepository(Productsize)
    private readonly productSizeRepository: Repository<Productsize>,
  ) {}
  create(createProductsizeDto: CreateProductsizeDto) {
    return this.productSizeRepository.save(createProductsizeDto);
  }

  findAll() {
    return this.productSizeRepository.find();
  }

  findOne(id: number) {
    return this.productSizeRepository.findOneBy({ id });
  }

  update(id: number, updateProductsizeDto: UpdateProductsizeDto) {
    return this.productSizeRepository.update(id, updateProductsizeDto);
  }

  async remove(id: number): Promise<void> {
    const productSize = await this.productSizeRepository.findOneBy({ id });
    if (!productSize) {
      throw new NotFoundException(`ProductSize with ID ${id} not found`);
    }
    await this.productSizeRepository.softRemove(productSize);
  }
}
