import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AdminService } from './admin.service';
import { ManageOrderDto } from './dto/manage-order.dto';
import { ManageProductDto } from './dto/manage-product.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Endpoint to manage products (add/update)
  @Post('products')
  async manageProduct(@Body() manageProductDto: ManageProductDto) {
    return this.adminService.manageProduct(manageProductDto);
  }

  // Endpoint to manage orders (update status or tracking number)
  @Patch('orders/:id')
  async manageOrder(
    @Param('id') id: string,
    @Body() manageOrderDto: ManageOrderDto,
  ) {
    return this.adminService.manageOrder(id, manageOrderDto);
  }
}
