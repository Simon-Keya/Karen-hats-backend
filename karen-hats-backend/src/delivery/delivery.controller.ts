import { Body, Controller, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { UpdateDeliveryDto } from './dto/update-delivery.dto';

@ApiTags('Deliveries')
@Controller('deliveries')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  // Create a new delivery
  @Post()
  async createDelivery(@Body() createDeliveryDto: CreateDeliveryDto) {
    return this.deliveryService.createDelivery(createDeliveryDto);
  }

  // Update a delivery by ID
  @Patch(':id')
  async updateDelivery(
    @Param('id') id: string,
    @Body() updateDeliveryDto: UpdateDeliveryDto,
  ) {
    return this.deliveryService.updateDelivery(id, updateDeliveryDto);
  }

  // Get a specific delivery by ID
  @Get(':id')
  async getDelivery(@Param('id') id: string) {
    const delivery = await this.deliveryService.getDelivery(id);
    if (!delivery) {
      throw new NotFoundException(`Delivery with ID ${id} not found`);
    }
    return delivery;
  }

  // Get all deliveries (useful for listing deliveries)
  @Get()
  async getAllDeliveries() {
    return this.deliveryService.getAllDeliveries();
  }
}
