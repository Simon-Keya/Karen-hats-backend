import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';
import { Delivery } from './entities/delivery.entity';

@Injectable()
export class DeliveryService {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepository: Repository<Delivery>,
  ) {}

  // Create a new delivery entry
  async createDelivery(createDeliveryDto: CreateDeliveryDto): Promise<Delivery> {
    const delivery = this.deliveryRepository.create(createDeliveryDto);
    return this.deliveryRepository.save(delivery);
  }

  // Update an existing delivery entry by ID
  async updateDelivery(id: string, updateDeliveryDto: UpdateDeliveryDto): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOneBy({ id });
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    // Merging updated fields into the existing delivery entity
    Object.assign(delivery, updateDeliveryDto);
    return this.deliveryRepository.save(delivery);
  }

  // Retrieve a delivery by ID
  async getDelivery(id: string): Promise<Delivery> {
    const delivery = await this.deliveryRepository.findOneBy({ id });
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    return delivery;
  }

  // Retrieve all deliveries (useful for listing deliveries)
  async getAllDeliveries(): Promise<Delivery[]> {
    return this.deliveryRepository.find();
  }
}
