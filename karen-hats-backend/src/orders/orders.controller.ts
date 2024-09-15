import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // Create a new order
  @Post()
  async createOrder(@Body() orderData: any) {
    return this.ordersService.createOrder(orderData);
  }

  // Update the tracking number for a specific order
  @Patch(':id/tracking')
  async updateTracking(@Param('id') id: string, @Body('trackingNumber') trackingNumber: string) {
    return this.ordersService.updateTracking(+id, trackingNumber); // Updated method name
  }

  // Get all orders for a specific user by user ID
  @Get('user/:userId')
  async findAllOrders(@Param('userId') userId: string) {
    return this.ordersService.findAllOrdersByUser(+userId); // Updated method name
  }

  // Update the status of a specific order
  @Patch(':id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(+id, status); // Updated method name
  }

  // Get a single order by its ID
  @Get(':id')
  async findOneOrder(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  // Delete an order by its ID
  @Delete(':id')
  async deleteOrder(@Param('id') id: string) {
    return this.ordersService.remove(+id); // Updated method name
  }
}
