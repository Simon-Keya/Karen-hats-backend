import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';

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

  async findOne(orderId: number) {
    // Fetch order by ID
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }
    return order;
  }

  async updateOrderTracking(orderId: number, trackingNumber: string) {
    const order = await this.findOne(orderId); // Use the newly added findOne method
    order.trackingNumber = trackingNumber;
    return this.orderRepository.save(order);
  }

  findAllOrders(userId: number) {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }

  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.findOne(orderId); // Use the newly added findOne method
    order.status = status;
    return this.orderRepository.save(order);
  }
}
