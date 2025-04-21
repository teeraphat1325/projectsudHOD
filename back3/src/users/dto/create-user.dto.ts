import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../roles/entities/role.entity';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    description: 'The name of the user',
    example: 'chan',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'chan@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The roles of the user',
    example: [{ id: 1 }, { id: 2 }],
  })
  @Type(() => Role)
  roles: Role[];

  @ApiProperty({
    description: 'The gender of the user',
    example: 'Male',
  })
  @IsNotEmpty()
  @IsEnum(['Male', 'Female'])
  gender: 'Male' | 'Female';

  @ApiProperty({
    description: 'The branch ID of the user',
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  branchesID?: number;
}
