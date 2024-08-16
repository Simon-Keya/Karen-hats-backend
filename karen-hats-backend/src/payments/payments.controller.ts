import { Body, Controller, Param, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('paypal/:orderId')
  async processPayPalPayment(@Param('orderId') orderId: string, @Body() paymentDetails: any) {
    return this.paymentsService.processPayPalPayment(+orderId, paymentDetails);
  }

  @Post('mpesa/:orderId')
  async processMpesaPayment(@Param('orderId') orderId: string, @Body('phoneNumber') phoneNumber: string, @Body('amount') amount: number) {
    return this.paymentsService.processMpesaPayment(+orderId, phoneNumber, amount);
  }

  @Post('stripe/:orderId')
  async processStripePayment(@Param('orderId') orderId: string, @Body('token') token: string) {
    return this.paymentsService.processStripePayment(+orderId, token);
  }
}
