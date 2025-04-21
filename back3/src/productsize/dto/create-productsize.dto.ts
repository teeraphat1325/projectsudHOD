import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductsizeDto {
  @ApiProperty({
    description: 'The name of the size',
    example: 'S',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the size',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
