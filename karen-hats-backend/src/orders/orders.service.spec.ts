import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entity/order.entity';
import { OrdersService } from './orders.service';

const mockOrder = {
  id: 1,
  productIds: [1, 2],
  totalAmount: 100,
  status: 'Pending',
  trackingNumber: null,
  customerName: 'John Doe',
  address: '123 Main St',
  createdAt: new Date(),
};

const mockOrderRepository = {
  create: jest.fn().mockImplementation((dto) => ({
    ...mockOrder,
    ...dto,
    createdAt: new Date(),
  })),
  save: jest.fn().mockResolvedValue(mockOrder),
  findOne: jest.fn().mockResolvedValue(mockOrder),
  find: jest.fn().mockResolvedValue([mockOrder]),
  update: jest.fn().mockResolvedValue({ affected: 0 }), // Simulate no rows affected
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
};

describe('OrdersService', () => {
  let service: OrdersService;
  let repository: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    repository = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  // ... Other tests ...

  it('should throw NotFoundException when updating a non-existent order', async () => {
    const updateOrderDto: UpdateOrderDto = {
      productIds: [1, 3],
      totalAmount: 150,
      status: 'Shipped',
      trackingNumber: 'TRACK123',
      customerName: 'Jane Doe',
      address: '456 Elm St',
    };

    mockOrderRepository.update.mockResolvedValueOnce({ affected: 0 }); // Simulate that no rows were updated
    mockOrderRepository.findOne.mockResolvedValueOnce(null); // Simulate order not found

    await expect(service.update(2, updateOrderDto)).rejects.toThrow(NotFoundException);
  });
});
