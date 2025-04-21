import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The name or title of the payment',
    example: 'Electricity Bill',
  })
  name: string;

  @ApiProperty({
    description: 'The amount of money for the payment',
    example: 1000.0,
  })
  amount: number;

  @ApiProperty({
    description: 'The date the payment was made or scheduled (YYYY-MM-DD)',
    example: '2025-04-16',
  })
  date: string;

  @ApiProperty({
    description: 'The current status of the payment',
    example: 'Pending',
    enum: ['Pending', 'Completed', 'Failed'],
  })
  status: 'Pending' | 'Completed' | 'Failed';

  @ApiProperty({
    description: 'The payment method used',
    example: 'Credit Card',
  })
  method: string;

  @ApiProperty({
    description: 'The currency in which the payment is made',
    example: 'THB',
  })
  currency: string;
}
