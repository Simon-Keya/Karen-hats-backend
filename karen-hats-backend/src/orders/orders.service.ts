import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto'; // Assuming you have this DTO for updating orders
import { Order } from './entity/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // Create a new order
  async createOrder(createOrderDto: CreateOrderDto) {
    const order = this.orderRepository.create(createOrderDto);
    return await this.orderRepository.save(order);
  }

  // Find a specific order by ID
  async findOne(id: number) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }

  // Find all orders
  async findAll() {
    return await this.orderRepository.find();
  }

  // Update tracking number for a specific order
  async updateTracking(id: number, trackingNumber: string) {
    const order = await this.findOne(id);
    order.trackingNumber = trackingNumber;
    return await this.orderRepository.save(order);
  }

  // Find all orders for a specific user by user ID
  async findAllOrdersByUser(userId: number) {
    // Adjusted to properly access the user relation in the `Order` entity
    return await this.orderRepository.find({
      where: { user: { id: userId } },
    });
  }

  // Update status for a specific order
  async updateStatus(id: number, status: string) {
    const order = await this.findOne(id);
    order.status = status;
    return await this.orderRepository.save(order);
  }

  // General update method for a specific order
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.orderRepository.update(id, updateOrderDto);
    const updatedOrder = await this.findOne(id); // Fetch the updated order
    if (!updatedOrder) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return updatedOrder;
  }

  // Remove a specific order by ID
  async remove(id: number) {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return { message: `Order #${id} deleted successfully` };
  }
}
