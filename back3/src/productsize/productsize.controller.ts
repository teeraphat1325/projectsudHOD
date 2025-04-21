import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsizeService } from './productsize.service';
import { CreateProductsizeDto } from './dto/create-productsize.dto';
import { UpdateProductsizeDto } from './dto/update-productsize.dto';

@Controller('productsize')
export class ProductsizeController {
  constructor(private readonly productsizeService: ProductsizeService) {}

  @Post()
  create(@Body() createProductsizeDto: CreateProductsizeDto) {
    return this.productsizeService.create(createProductsizeDto);
  }

  @Get()
  findAll() {
    return this.productsizeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsizeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductsizeDto: UpdateProductsizeDto,
  ) {
    return this.productsizeService.update(+id, updateProductsizeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsizeService.remove(+id);
  }
}
