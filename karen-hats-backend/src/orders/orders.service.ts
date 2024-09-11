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

  // Create a new order
  createOrder(orderData: Partial<Order>) {
    const order = this.orderRepository.create(orderData);
    return this.orderRepository.save(order);
  }

  // Find a single order by its ID
  async findOne(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  // Update the tracking number of an order
  async updateOrderTracking(orderId: number, trackingNumber: string): Promise<Order> {
    const order = await this.findOne(orderId);
    order.trackingNumber = trackingNumber;
    return this.orderRepository.save(order);
  }

  // Retrieve all orders for a specific user by user ID
  async findAllOrders(userId: number): Promise<Order[]> {
    return this.orderRepository.find({ where: { user: { id: userId } } });
  }

  // Update the status of an order
  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.findOne(orderId);
    order.status = status;
    return this.orderRepository.save(order);
  }

  // Delete an order by its ID
  async deleteOrder(orderId: number): Promise<void> {
    const result = await this.orderRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }
}
