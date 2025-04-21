import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'Burger',
  })
  name: string;

  @ApiProperty({
    description: 'Phonenumber of Customer',
    example: '0123456789',
  })
  phone: string;

  @ApiProperty({
    description: 'Total Point ',
    example: '10',
  })
  point: number;
}
