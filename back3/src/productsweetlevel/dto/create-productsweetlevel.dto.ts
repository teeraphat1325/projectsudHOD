import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductsweetlevelDto {
  @ApiProperty({
    description: 'The level of the sweet',
    example: '100',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the sweet',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
