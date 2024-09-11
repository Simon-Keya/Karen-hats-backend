import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../orders/entity/order.entity'; // Make sure the path is correct
import { Product } from '../products/entities/product.entity'; // Assuming you have a Product entity
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Order, Product]), // Register your repositories here
  ],
  providers: [AdminService],
  exports: [AdminService], // Export if you need to use it in other modules
})
export class AdminModule {}
