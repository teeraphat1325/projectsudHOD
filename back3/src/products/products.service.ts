import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Type } from 'src/types/entities/type.entity';
import { In } from 'typeorm';
import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { Productsize } from 'src/productsize/entities/productsize.entity';
import { Productsweetlevel } from 'src/productsweetlevel/entities/productsweetlevel.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Type)
    private readonly typesRepository: Repository<Type>,
    @InjectRepository(ProductCategory)
    private readonly productCategoriesRepository: Repository<ProductCategory>,
    @InjectRepository(Productsize)
    private readonly productSizesReposity: Repository<Productsize>,
    @InjectRepository(Productsweetlevel)
    private readonly productSweetLevelsRepository: Repository<Productsweetlevel>,
  ) {}

  async create(
    createProductDto: CreateProductDto & { imageUrl: string },
  ): Promise<Product> {
    const productSizes = createProductDto.productSizes
      ? await this.productSizesReposity.find({
          where: {
            id: In(createProductDto.productSizes.map((s) => s.id)),
          },
        })
      : [];

    const types = createProductDto.types
      ? await this.typesRepository.find({
          where: {
            id: In(createProductDto.types.map((t) => t.id)),
          },
        })
      : [];

    const productSweetLevels = createProductDto.productSweetLevels
      ? await this.productSweetLevelsRepository.find({
          where: {
            id: In(createProductDto.productSweetLevels.map((sw) => sw.id)),
          },
        })
      : [];
    // Find the product category
    const productCategory = await this.productCategoriesRepository.findOne({
      where: { id: createProductDto.productCategory.id },
    });
    if (!productCategory) {
      throw new NotFoundException('Product Category not found');
    }

    const newProduct = this.productsRepository.create({
      ...createProductDto,
      types,
      productCategory,
      productSizes,
      productSweetLevels,
    });

    await this.productsRepository.save(newProduct);

    return this.productsRepository.findOneOrFail({
      where: { id: newProduct.id },
      relations: [
        'types',
        'productCategory',
        'productSizes',
        'productSweetLevels',
      ],
    });
  }

  async findAll(): Promise<Product[]> {
    return await this.productsRepository.find({
      relations: [
        'types',
        'productCategory',
        'productSizes',
        'productSweetLevels',
      ],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneOrFail({
      where: { id: id },
      relations: [
        'types',
        'productCategory',
        'productSizes',
        'productSweetLevels',
      ],
    });
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto & { imageUrl?: string },
  ): Promise<Product> {
    if (!updateProductDto.imageUrl) {
      delete updateProductDto.file;
      delete updateProductDto.imageUrl;
    }

    const product = await this.productsRepository.findOne({
      where: { id },
      relations: [
        'types',
        'productCategory',
        'productSizes',
        'productSweetLevels',
      ],
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (updateProductDto.productCategory) {
      const productCategory = await this.productCategoriesRepository.findOne({
        where: { id: updateProductDto.productCategory.id },
      });
      if (!productCategory) {
        throw new NotFoundException('Product Category not found');
      }
      product.productCategory = productCategory;
    }

    if (updateProductDto.types) {
      const types = await this.typesRepository.find({
        where: {
          id: In(updateProductDto.types),
        },
      });
      product.types = types;
    }
    if (updateProductDto.productSizes) {
      const productSizes = await this.productSizesReposity.find({
        where: {
          id: In(updateProductDto.productSizes),
        },
      });
      product.productSizes = productSizes;
    }
    if (updateProductDto.productSweetLevels) {
      const productSweetLevels = await this.productSweetLevelsRepository.find({
        where: {
          id: In(updateProductDto.productSweetLevels),
        },
      });
      product.productSweetLevels = productSweetLevels;
    }

    Object.assign(product, updateProductDto);

    await this.productsRepository.save(product);

    return this.productsRepository.findOneOrFail({
      where: { id },
      relations: [
        'types',
        'productCategory',
        'productSizes',
        'productSweetLevels',
      ],
    });
  }

  async remove(id: number): Promise<void> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    await this.productsRepository.softRemove(product);
  }
}
