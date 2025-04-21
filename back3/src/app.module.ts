import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './roles/entities/role.entity';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { SalariesModule } from './salaries/salaries.module';
import { Salary } from './salaries/entities/salary.entity';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { TypesModule } from './types/types.module';
import { Type } from './types/entities/type.entity';
import { InventoryItemsModule } from './inventory-items/inventory-items.module';
import { InventoryItem } from './inventory-items/entities/inventory-item.entity';
import { StockcheckRecordModule } from './stockcheck-record/stockcheck-record.module';
import { StockcheckDetailModule } from './stockcheck-detail/stockcheck-detail.module';
import { StockcheckDetail } from './stockcheck-detail/entities/stockcheck-detail.entity';
import { OrderDetailModule } from './order-detail/order-detail.module';
import { OrderDetail } from './order-detail/entities/order-detail.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { ProductCategoriesModule } from './product-categories/product-categories.module';
import { ProductCategory } from './product-categories/entities/product-category.entity';
import { CheckTime } from './checktime/entities/checktime.entity';
import { CheckTimesModule } from './checktime/checktime.module';
import { CustomersModule } from './customers/customers.module';
import { Customer } from './customers/entities/customer.entity';
import { PaymentsModule } from './payments/payments.module';
import { Payment } from './payments/entities/payment.entity';
import { Branch } from './branches/entities/branch.entity';
import { BranchesModule } from './branches/branches.module';
import { OrderRecord } from './order-record/entities/order-record.entity';
import { StockcheckRecord } from './stockcheck-record/entities/stockcheck-record.entity';
import { UsageRecord } from './usage-record/entities/usage-record.entity';
import { UsageDetail } from './usage-detail/entities/usage-detail.entity';
import { UsageRecordModule } from './usage-record/usage-record.module';
import { UsageDetailModule } from './usage-detail/usage-detail.module';
import { OrderRecordModule } from './order-record/order-record.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { CartItem } from './cart-item/entities/cart-item.entity';
import { ProductsizeModule } from './productsize/productsize.module';
import { Productsize } from './productsize/entities/productsize.entity';
import { ProductsweetlevelModule } from './productsweetlevel/productsweetlevel.module';
import { Productsweetlevel } from './productsweetlevel/entities/productsweetlevel.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads/products'),
      serveRoot: '/product-images',
    }),
    UsersModule,
    RolesModule,
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [
    //     User,
    //     Role,
    //     Salary,
    //     Category,
    //     Type,
    //     InventoryItem,
    //     StockcheckDetail,
    //     OrderDetail,
    //     Product,
    //     ProductCategory,
    //     CheckTime,
    //     Customer,
    //     Payment,
    //     Branch,
    //     OrderRecord,
    //     StockcheckRecord,
    //     UsageRecord,
    //     UsageDetail,
    //     CartItem,
    //     Productsize,
    //     Productsweetlevel,
    //   ],
    //   synchronize: true,
    // }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'User01',
      password: 'password',
      database: 'coffee_db',
      entities: [
        User,
        Role,
        Salary,
        Category,
        Type,
        InventoryItem,
        StockcheckDetail,
        OrderDetail,
        Product,
        ProductCategory,
        CheckTime,
        Customer,
        Payment,
        Branch,
        OrderRecord,
        StockcheckRecord,
        UsageRecord,
        UsageDetail,
        CartItem,
        Productsize,
        Productsweetlevel,
      ],
      synchronize: true,
    }),

    AuthModule,
    SalariesModule,
    CategoriesModule,
    TypesModule,
    InventoryItemsModule,
    StockcheckRecordModule,
    StockcheckDetailModule,
    OrderDetailModule,
    ProductsModule,
    ProductCategoriesModule,
    CheckTimesModule,
    CustomersModule,
    PaymentsModule,
    BranchesModule,
    UsageRecordModule,
    UsageDetailModule,
    OrderRecordModule,
    CartItemModule,
    ProductsizeModule,
    ProductsweetlevelModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
