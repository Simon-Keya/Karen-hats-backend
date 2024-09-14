import { Test, TestingModule } from '@nestjs/testing';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let paymentsController: PaymentsController;
  let paymentsService: PaymentsService;

  const mockPaymentsService = {
    create: jest.fn((dto: CreatePaymentDto) => Promise.resolve({ id: 1, ...dto })),
    findAll: jest.fn(() => Promise.resolve([{ id: 1, orderId: '123', amount: 100, paymentMethod: 'Mpesa' }])),
    findOne: jest.fn((id: number) => Promise.resolve({ id, orderId: '123', amount: 100, paymentMethod: 'Mpesa' })),
    update: jest.fn((id: number, dto: UpdatePaymentDto) => Promise.resolve({ id, ...dto })),
    remove: jest.fn((id: number) => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockPaymentsService,
        },
      ],
    }).compile();

    paymentsController = module.get<PaymentsController>(PaymentsController);
    paymentsService = module.get<PaymentsService>(PaymentsService);
  });

  describe('create', () => {
    it('should create a payment', async () => {
      const dto: CreatePaymentDto = { orderId: '123', amount: 100, paymentMethod: 'Mpesa' };
      const result = await paymentsController.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockPaymentsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all payments', async () => {
      const result = await paymentsController.findAll();
      expect(result).toEqual([{ id: 1, orderId: '123', amount: 100, paymentMethod: 'Mpesa' }]);
      expect(mockPaymentsService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single payment', async () => {
      const result = await paymentsController.findOne('1');
      expect(result).toEqual({ id: 1, orderId: '123', amount: 100, paymentMethod: 'Mpesa' });
      expect(mockPaymentsService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a payment', async () => {
      const dto: UpdatePaymentDto = { amount: 200, paymentMethod: 'Mpesa' };
      const result = await paymentsController.update('1', dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockPaymentsService.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a payment', async () => {
      const result = await paymentsController.remove('1');
      expect(result).toEqual({ id: 1 });
      expect(mockPaymentsService.remove).toHaveBeenCalledWith(1);
    });
  });
});
