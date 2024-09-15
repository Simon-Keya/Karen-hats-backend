import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from '../orders/orders.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let paymentsService: PaymentsService;

  const mockPaymentRepository = {
    save: jest.fn((payment) => Promise.resolve({ id: 1, ...payment })),
    find: jest.fn(() => Promise.resolve([{ id: 1, paymentMethod: 'Mpesa' }])),
    findOne: jest.fn((id) => Promise.resolve({ id, paymentMethod: 'Mpesa' })),
    update: jest.fn((id, payment) => Promise.resolve({ id, ...payment })),
    delete: jest.fn((id) => Promise.resolve({ affected: 1 })), // Changed from remove to delete
  };

  const mockOrdersService = {
    updateOrderStatus: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'SOME_CONFIG':
          return 'someValue';
        default:
          return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: OrdersService,
          useValue: mockOrdersService, // Provide the mock OrdersService
        },
        {
          provide: 'PaymentRepository',
          useValue: mockPaymentRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto: CreatePaymentDto = { orderId: '123', amount: 100, paymentMethod: 'Mpesa' };
      const result = await paymentsService.create(dto);
      expect(result).toEqual({ message: 'Payment created successfully', payment: { id: 1, ...dto } });
      expect(mockPaymentRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const result = await paymentsService.findAll();
      expect(result).toEqual({
        message: 'All payments retrieved successfully',
        payments: [{ id: 1, paymentMethod: 'Mpesa' }],
      });
      expect(mockPaymentRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single payment', async () => {
      const result = await paymentsService.findOne(1);
      expect(result).toEqual({
        message: `Payment with ID 1 retrieved successfully`,
        payment: { id: 1, paymentMethod: 'Mpesa' },
      });
      expect(mockPaymentRepository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const dto: UpdatePaymentDto = { amount: 200, paymentMethod: 'Mpesa' };
      const result = await paymentsService.update(1, dto);
      expect(result).toEqual({ message: `Payment with ID 1 updated successfully`, update: dto });
      expect(mockPaymentRepository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a payment', async () => {
      const result = await paymentsService.remove(1);
      expect(result).toEqual({ message: `Payment with ID 1 removed successfully` });
      expect(mockPaymentRepository.delete).toHaveBeenCalledWith(1); // Changed from remove to delete
    });
  });
});
