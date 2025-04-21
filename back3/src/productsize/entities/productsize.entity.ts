import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Product } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Productsize {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Size',
    example: 'S',
  })
  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ApiProperty({
    description: 'Price size',
    example: 10,
  })
  @Column()
  price?: number;

  @ManyToMany(() => Product, (product) => product.productSizes)
  products: Product[];
}
