import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CheckTime } from 'src/checktime/entities/checktime.entity';
import { OrderRecord } from 'src/order-record/entities/order-record.entity';
import { UsageRecord } from 'src/usage-record/entities/usage-record.entity';
import { StockcheckRecord } from 'src/stockcheck-record/entities/stockcheck-record.entity';
import { Branch } from 'src/branches/entities/branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Branch,
      CheckTime,
      OrderRecord,
      UsageRecord,
      StockcheckRecord,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
