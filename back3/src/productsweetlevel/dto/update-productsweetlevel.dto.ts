import { PartialType } from '@nestjs/swagger';
import { CreateProductsweetlevelDto } from './create-productsweetlevel.dto';

export class UpdateProductsweetlevelDto extends PartialType(
  CreateProductsweetlevelDto,
) {}
