import { ApiProperty } from '@nestjs/swagger';

export class CreateBranchDto {
  @ApiProperty({
    description: 'ชื่อสาขา',
    example: 'สาขาเซ็นทรัลลาดพร้าว',
  })
  name: string;

  @ApiProperty({
    description: 'ที่อยู่',
    example: '123 ถนนลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพมหานคร 10900',
  })
  address: string;
  @ApiProperty({
    description: 'วันที่เปิดสาขา',
    example: '2023-01-01',
  })
  OpenDate: Date;
  @ApiProperty({
    description: 'เบอร์โทรศัพท์',
    example: '0888888888',
  })
  phone: number;
}
