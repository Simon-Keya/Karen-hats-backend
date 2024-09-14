import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {

  constructor(
    @Inject(ConfigService) private configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {}

  async processMpesaPayment(orderId: number, phoneNumber: string, amount: number) {
    try {
      const token = await this.getMpesaToken();
      const response = await axios.post(
        `${this.configService.get('MPESA_API_URL')}/mpesa/stkpush/v1/processrequest`,
        {
          BusinessShortCode: this.configService.get('MPESA_SHORTCODE'),
          Password: this.generateMpesaPassword(),
          Timestamp: this.getTimestamp(),
          TransactionType: 'CustomerPayBillOnline',
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: this.configService.get('MPESA_SHORTCODE'),
          PhoneNumber: phoneNumber,
          CallBackURL: this.configService.get('MPESA_CALLBACK_URL'),
          AccountReference: orderId,
          TransactionDesc: `Payment for Order #${orderId}`,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Handle successful payment
      await this.ordersService.updateOrderStatus(orderId, 'Paid');
      return {
        status: 'success',
        message: 'Payment processed successfully',
        mpesaReceiptNumber: response.data.CheckoutRequestID,
      };
    } catch (error) {
      await this.ordersService.updateOrderStatus(orderId, 'Payment Failed');
      return {
        status: 'failed',
        message: 'Payment failed',
        error: error.message,
      };
    }
  }

  private async getMpesaToken() {
    const response = await axios.get(
      `${this.configService.get('MPESA_API_URL')}/oauth/v1/generate?grant_type=client_credentials`,
      {
        auth: {
          username: this.configService.get('MPESA_CONSUMER_KEY'),
          password: this.configService.get('MPESA_CONSUMER_SECRET'),
        },
      },
    );
    return response.data.access_token;
  }

  private generateMpesaPassword(): string {
    const shortCode = this.configService.get('MPESA_SHORTCODE');
    const passkey = this.configService.get('MPESA_PASSKEY');
    const timestamp = this.getTimestamp();
    const dataToEncode = shortCode + passkey + timestamp;
    return Buffer.from(dataToEncode).toString('base64');
  }

  private getTimestamp(): string {
    const now = new Date();
    return (
      now.getFullYear().toString() +
      ('0' + (now.getMonth() + 1)).slice(-2) +
      ('0' + now.getDate()).slice(-2) +
      ('0' + now.getHours()).slice(-2) +
      ('0' + now.getMinutes()).slice(-2) +
      ('0' + now.getSeconds()).slice(-2)
    );
  }

  // Add 'create' method
  async create(createPaymentDto: CreatePaymentDto) {
    // Implement logic for creating a new payment
    return { message: 'Payment created successfully', payment: createPaymentDto };
  }

  // Add 'findAll' method
  async findAll() {
    // Implement logic for retrieving all payments
    return { message: 'All payments retrieved successfully' };
  }

  // Add 'findOne' method
  async findOne(id: number) {
    // Implement logic for retrieving a specific payment by id
    return { message: `Payment with ID ${id} retrieved successfully` };
  }

  // Add 'update' method
  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    // Implement logic for updating a specific payment
    return { message: `Payment with ID ${id} updated successfully`, update: updatePaymentDto };
  }

  // Add 'remove' method
  async remove(id: number) {
    // Implement logic for removing a specific payment
    return { message: `Payment with ID ${id} removed successfully` };
  }
}
