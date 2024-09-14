import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto'; // Ensure this DTO is created
import { Order } from './entity/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Create a new order
  async createOrder(orderData: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create({
      ...orderData,
      createdAt: new Date(),
    });
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

  // Retrieve all orders
  async findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  // Update an order
  async update(orderId: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(orderId);
    const updatedOrder = Object.assign(order, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }

  // Delete an order by its ID
  async remove(orderId: number): Promise<void> {
    const result = await this.orderRepository.delete(orderId);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
  }
}
