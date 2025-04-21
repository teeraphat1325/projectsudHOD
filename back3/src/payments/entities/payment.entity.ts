import { IsNotEmpty, IsString } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column()
  @IsNotEmpty()
  amount: number;

  @Column()
  date: string;

  @Column()
  status: 'Pending' | 'Completed' | 'Failed';

  @Column()
  method: string;

  @Column()
  currency: string;
}
