import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTypeDto {
  @ApiProperty({
    description: 'The name of the type',
    example: 'Hot',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The price of the type',
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;
}
