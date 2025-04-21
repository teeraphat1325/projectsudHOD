import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductsweetlevelDto } from './dto/create-productsweetlevel.dto';
import { UpdateProductsweetlevelDto } from './dto/update-productsweetlevel.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Productsweetlevel } from './entities/productsweetlevel.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsweetlevelService {
  constructor(
    @InjectRepository(Productsweetlevel)
    private readonly productSweetLevelRepository: Repository<Productsweetlevel>,
  ) {}

  create(createProductsweetlevelDto: CreateProductsweetlevelDto) {
    return this.productSweetLevelRepository.save(createProductsweetlevelDto);
  }

  findAll() {
    return this.productSweetLevelRepository.find();
  }

  findOne(id: number) {
    return this.productSweetLevelRepository.findOneBy({ id });
  }

  update(id: number, updateProductsweetlevelDto: UpdateProductsweetlevelDto) {
    return this.productSweetLevelRepository.update(
      id,
      updateProductsweetlevelDto,
    );
  }

  async remove(id: number): Promise<void> {
    const productSweetLevel = await this.productSweetLevelRepository.findOneBy({
      id,
    });
    if (!productSweetLevel) {
      throw new NotFoundException(`Productsweetlevel with ID ${id} not found`);
    }
    await this.productSweetLevelRepository.softRemove(productSweetLevel);
  }
}
