import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entity/order.entity'; // Correct path to the Order entity
import { Product } from '../products/entities/product.entity'; // Assuming you have a Product entity
import { ManageOrderDto } from './dto/manage-order.dto';
import { ManageProductDto } from './dto/manage-product.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Manage products in inventory (add/update)
  async manageProduct(manageProductDto: ManageProductDto): Promise<any> {
    const product = manageProductDto.id
      ? await this.updateProduct(manageProductDto)
      : await this.createProduct(manageProductDto);

    return { message: 'Product managed successfully', product };
  }

  private async updateProduct(manageProductDto: ManageProductDto): Promise<Product> {
    const product = await this.productRepository.preload({
      id: manageProductDto.id,
      ...manageProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${manageProductDto.id} not found`);
    }

    return this.productRepository.save(product);
  }

  private async createProduct(manageProductDto: ManageProductDto): Promise<Product> {
    const product = this.productRepository.create(manageProductDto);
    return this.productRepository.save(product);
  }

  // Manage orders (update status, tracking, etc.)
  async manageOrder(id: string, manageOrderDto: ManageOrderDto): Promise<any> {
    const orderId = parseInt(id, 10); // Convert the string ID to a number

    const order = await this.findOrderById(orderId);
    
    // Update order details with the DTO fields
    Object.assign(order, manageOrderDto);

    await this.orderRepository.save(order);
    return { message: `Order with ID ${orderId} managed successfully`, order };
  }

  private async findOrderById(orderId: number): Promise<Order> {
    const order = await this.orderRepository.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }
}
