import { Salary } from 'src/salaries/entities/salary.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class CheckTime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.checktime)
  @JoinColumn({ name: 'userId' })
  userId: number;

  @Column({ type: 'datetime' })
  checkInTime: Date;

  @Column({ type: 'datetime', nullable: true })
  checkOutTime: Date;

  @Column()
  totalHours: number;

  // ใช้ @ManyToOne เพื่อเชื่อมโยง CheckTime กับ Salary
  @ManyToOne(() => Salary, (salary) => salary.checkTimes, { nullable: true })
  @JoinColumn({ name: 'salaryId' }) // กำหนดชื่อคอลัมน์ที่เชื่อมโยง
  salary: Salary; // เชื่อมโยง CheckTime ไปยัง Salary
}
