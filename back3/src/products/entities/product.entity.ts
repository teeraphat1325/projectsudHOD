import { ProductCategory } from 'src/product-categories/entities/product-category.entity';
import { Productsize } from 'src/productsize/entities/productsize.entity';
import { Productsweetlevel } from 'src/productsweetlevel/entities/productsweetlevel.entity';
import { Type } from 'src/types/entities/type.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column({ default: '/product-images/unknown.jpg' })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToMany(() => Type, (type) => type.products, { cascade: true })
  @JoinTable()
  types: Type[];

  @ManyToOne(
    () => ProductCategory,
    (productCategory) => productCategory.products,
    { cascade: true },
  )
  productCategory: ProductCategory;

  @ManyToMany(() => Productsize, (productSize) => productSize.products, {
    cascade: true,
  })
  @JoinTable()
  productSizes: Productsize[];

  @ManyToMany(
    () => Productsweetlevel,
    (productSweetLevel) => productSweetLevel.products,
    {
      cascade: true,
    },
  )
  @JoinTable()
  productSweetLevels: Productsweetlevel[];
}
