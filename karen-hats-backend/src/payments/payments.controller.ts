import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('mpesa/:orderId')
  async processMpesaPayment(
    @Param('orderId') orderId: string, 
    @Body('phoneNumber') phoneNumber: string, 
    @Body('amount') amount: number
  ) {
    return this.paymentsService.processMpesaPayment(+orderId, phoneNumber, amount);
  }
}
