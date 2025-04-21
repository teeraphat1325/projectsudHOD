import { PartialType } from '@nestjs/swagger';
import { CreateProductsizeDto } from './create-productsize.dto';

export class UpdateProductsizeDto extends PartialType(CreateProductsizeDto) {}
