import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mpesa/:orderId')
  async processMpesaPayment(
    @Param('orderId') orderId: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('amount') amount: number,
  ) {
    // Ensure orderId is converted to a number for the service
    return this.paymentsService.processMpesaPayment(Number(orderId), phoneNumber, amount);
  }

  // Add 'create' method
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  // Add 'findAll' method
  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  // Add 'findOne' method
  @Get(':id')
  findOne(@Param('id') id: string) {
    // Convert 'id' to a number
    return this.paymentsService.findOne(+id);
  }

  // Add 'update' method
  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    // Convert 'id' to a number
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  // Add 'remove' method
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Convert 'id' to a number
    return this.paymentsService.remove(+id);
  }
}
