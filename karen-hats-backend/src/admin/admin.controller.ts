import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ManageOrderDto } from './dto/manage-order.dto';
import { ManageProductDto } from './dto/manage-product.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('products')
  manageProduct(@Body() manageProductDto: ManageProductDto) {
    return this.adminService.manageProduct(manageProductDto);
  }

  @Patch('orders/:id')
  manageOrder(
    @Param('id') id: string,
    @Body() manageOrderDto: ManageOrderDto,
  ) {
    return this.adminService.manageOrder(id, manageOrderDto);
  }
}
