import { IsDate, IsNumber, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  name: string;

  @Column()
  address: string;

  @IsDate()
  @Column()
  OpenDate: Date;

  @IsNumber()
  @Column()
  phone: number;

  @OneToMany(() => User, (user) => user.branch)
  user: User[];
}
