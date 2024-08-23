import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from '../orders/orders.module'; // Import OrdersModule
import { Payment } from './entities/payment.entity';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), OrdersModule], // Include OrdersModule in imports
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
