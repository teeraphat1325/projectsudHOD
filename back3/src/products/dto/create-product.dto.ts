import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { Type } from 'src/types/entities/type.entity';
import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { Productsize } from 'src/productsize/entities/productsize.entity';
import { Productsweetlevel } from 'src/productsweetlevel/entities/productsweetlevel.entity';

export class CreateProductDto {
  @ApiProperty({
    description: 'ชื่อของสินค้า',
    example: 'Coffee',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'ราคาของสินค้า',
    example: 100,
    minimum: 0,
  })
  @IsInt()
  @IsNotEmpty()
  @Min(0)
  @Transform(({ value }) => Number(value))
  price: number;

  @ApiProperty({
    description: 'Id ของ size',
    example: [1, 2, 3],
  })
  @IsOptional()
  productSizes?: Productsize[];

  @ApiProperty({
    description: 'Id ของ sweetlevel',
    example: [1, 2, 3],
  })
  @IsOptional()
  productSweetLevels?: Productsweetlevel[];

  @ApiProperty({
    description: 'Id ของประเภทของสินค้า',
    example: [1, 2, 3],
  })
  @IsOptional()
  types?: Type[];

  @ApiProperty({
    description: 'Id ของหมวดหมู่ของสินค้า',
    example: 1,
  })
  @IsNotEmpty()
  productCategory: ProductCategory;

  @ApiProperty({
    description: 'รูปภาพของสินค้า',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional() //validate
  file?: string;
}
