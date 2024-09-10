import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';

ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() orderData: any) {
    return this.ordersService.createOrder(orderData);
  }

  @Patch(':id/tracking')
  updateTracking(@Param('id') id: string, @Body('trackingNumber') trackingNumber: string) {
    return this.ordersService.updateOrderTracking(+id, trackingNumber);
  }

  @Get('user/:userId')
  findAllOrders(@Param('userId') userId: string) {
    return this.ordersService.findAllOrders(+userId);
  }

  @Patch(':id/status')
  updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateOrderStatus(+id, status);
  }
}
