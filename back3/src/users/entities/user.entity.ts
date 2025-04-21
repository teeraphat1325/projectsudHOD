import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { CheckTime } from 'src/checktime/entities/checktime.entity';
import { UsageRecord } from 'src/usage-record/entities/usage-record.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { OrderRecord } from 'src/order-record/entities/order-record.entity';
import { StockcheckRecord } from 'src/stockcheck-record/entities/stockcheck-record.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  gender: 'Male' | 'Female';

  @OneToMany(() => CheckTime, (checkInOut) => checkInOut.userId) // ความสัมพันธ์ One-to-Many
  checktime: CheckTime[]; // ผู้ใช้แต่ละคนสามารถมีหลาย CheckInOut

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable()
  roles: Role[];

  @OneToMany(
    () => StockcheckRecord,
    (stockcheckRecord) => stockcheckRecord.user,
  )
  stockcheckRecords: StockcheckRecord[];

  @OneToMany(() => OrderRecord, (orderRecord) => orderRecord.user)
  orderRecords: OrderRecord[];

  @OneToMany(() => UsageRecord, (usageRecord) => usageRecord.user)
  usageRecords: UsageRecord[];

  @Exclude()
  @ManyToOne(() => Branch, (branch) => branch.user) // ความสัมพันธ์ One-to-Many
  @JoinColumn({ name: 'branchesID' })
  branch: Branch;

  @ApiProperty({
    description: 'ID of branches',
    example: 1,
    nullable: true,
  })
  @Column({ nullable: true })
  branchesID: number;
}
