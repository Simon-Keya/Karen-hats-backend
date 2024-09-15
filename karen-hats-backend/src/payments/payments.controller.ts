import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  // Process Mpesa payment
  @ApiOperation({ summary: 'Process Mpesa payment' })
  @ApiResponse({ status: 201, description: 'Mpesa payment processed successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  @Post('mpesa/:orderId')
  @HttpCode(HttpStatus.OK) // Custom status code for successful Mpesa processing
  async processMpesaPayment(
    @Param('orderId') orderId: string,
    @Body('phoneNumber') phoneNumber: string,
    @Body('amount') amount: number,
  ) {
    // Convert orderId to a number and call the service to process the payment
    return this.paymentsService.processMpesaPayment(Number(orderId), phoneNumber, amount);
  }

  // Create a new payment
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({ status: 201, description: 'Payment created successfully' })
  @Post()
  @HttpCode(HttpStatus.CREATED) // Ensure that a 201 status is returned for creation
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  // Retrieve all payments
  @ApiOperation({ summary: 'Retrieve all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.paymentsService.findAll();
  }

  // Retrieve a specific payment by ID
  @ApiOperation({ summary: 'Retrieve a specific payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    // Convert 'id' to a number
    return this.paymentsService.findOne(+id);
  }

  // Update a specific payment
  @ApiOperation({ summary: 'Update a specific payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string, 
    @Body() updatePaymentDto: UpdatePaymentDto
  ) {
    // Convert 'id' to a number
    return this.paymentsService.update(+id, updatePaymentDto);
  }

  // Remove a specific payment
  @ApiOperation({ summary: 'Remove a specific payment' })
  @ApiResponse({ status: 200, description: 'Payment removed successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    // Convert 'id' to a number
    return this.paymentsService.remove(+id);
  }
}
