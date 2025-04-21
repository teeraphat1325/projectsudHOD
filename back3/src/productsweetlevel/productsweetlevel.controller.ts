import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductsweetlevelService } from './productsweetlevel.service';
import { CreateProductsweetlevelDto } from './dto/create-productsweetlevel.dto';
import { UpdateProductsweetlevelDto } from './dto/update-productsweetlevel.dto';

@Controller('productsweetlevel')
export class ProductsweetlevelController {
  constructor(
    private readonly productsweetlevelService: ProductsweetlevelService,
  ) {}

  @Post()
  create(@Body() createProductsweetlevelDto: CreateProductsweetlevelDto) {
    return this.productsweetlevelService.create(createProductsweetlevelDto);
  }

  @Get()
  findAll() {
    return this.productsweetlevelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsweetlevelService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductsweetlevelDto: UpdateProductsweetlevelDto,
  ) {
    return this.productsweetlevelService.update(
      +id,
      updateProductsweetlevelDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsweetlevelService.remove(+id);
  }
}
