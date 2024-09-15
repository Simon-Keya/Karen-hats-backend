import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject('PaymentRepository') private paymentRepository: any, // Inject the Payment Repository
    @Inject(ConfigService) private configService: ConfigService,
    private readonly ordersService: OrdersService,
  ) {}

  // Create a new payment
  async create(createPaymentDto: CreatePaymentDto) {
    const payment = await this.paymentRepository.save(createPaymentDto);
    return { message: 'Payment created successfully', payment };
  }

  // Retrieve all payments
  async findAll() {
    const payments = await this.paymentRepository.find();
    return { message: 'All payments retrieved successfully', payments };
  }

  // Retrieve a specific payment by ID
  async findOne(id: number) {
    const payment = await this.paymentRepository.findOne(id);
    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return { message: `Payment with ID ${id} retrieved successfully`, payment };
  }

  // Update a specific payment
  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const result = await this.paymentRepository.update(id, updatePaymentDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return { message: `Payment with ID ${id} updated successfully`, update: updatePaymentDto };
  }

  // Remove a specific payment
  async remove(id: number) {
    const result = await this.paymentRepository.delete(id); // Changed from remove to delete
    if (result.affected === 0) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }
    return { message: `Payment with ID ${id} removed successfully` };
  }

  // Process Mpesa payment
  async processMpesaPayment(orderId: number, phoneNumber: string, amount: number) {
    // Validate the order
    const order = await this.ordersService.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    // Logic to process the Mpesa payment, like integrating with an Mpesa API.
    const paymentResponse = await this.processMpesaApi(phoneNumber, amount);

    // Assuming payment is successful, you can then save the payment details
    const payment = await this.paymentRepository.save({
      orderId,
      phoneNumber,
      amount,
      paymentMethod: 'Mpesa',
      status: paymentResponse.status,
    });

    return { message: 'Mpesa payment processed successfully', payment };
  }

  // Mocking a method to process Mpesa API call
  private async processMpesaApi(phoneNumber: string, amount: number) {
    // Simulate an API call to Mpesa
    return { status: 'success', transactionId: 'TX123456' }; // Mocked response
  }
}
