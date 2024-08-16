import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  createOrder(orderData: Partial<Order>) {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  async updateOrderTracking(orderId: number, trackingNumber: string) {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    order.trackingNumber = trackingNumber;
    return this.orderRepository.save(order);
  }

  findAllOrders(userId: number) {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }

  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    order.status = status;
    return this.orderRepository.save(order);
  }
}
