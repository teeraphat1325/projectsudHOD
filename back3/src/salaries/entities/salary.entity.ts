import { CheckTime } from 'src/checktime/entities/checktime.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Salary {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payDate: string;

  @Column()
  amount: number;

  @Column()
  userID: number;

  @Column()
  totalHours: number;

  @Column({ nullable: true })
  paymentMethod?: 'cash' | 'transfer';

  @OneToMany(() => CheckTime, (checkTime) => checkTime.salary) // เชื่อมโยงกับ CheckTime
  checkTimes: CheckTime[]; // สามารถเข้าถึง CheckTime หลายๆ รายการที่เชื่อมโยงกับ Salary
}
