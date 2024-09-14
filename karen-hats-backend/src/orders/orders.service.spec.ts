import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto'; // Assuming you have this DTO
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
  create: jest.fn().mockImplementation((dto) => {
    return { ...mockOrder, ...dto };
  }),
  save: jest.fn().mockResolvedValue(mockOrder),
  findOne: jest.fn().mockResolvedValue(mockOrder),
  find: jest.fn().mockResolvedValue([mockOrder]),
  update: jest.fn().mockResolvedValue(mockOrder),
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

  it('should create an order', async () => {
    const createOrderDto: CreateOrderDto = {
      productIds: [1, 2],
      totalAmount: 100,
      status: 'Pending',
      trackingNumber: null,
      customerName: 'John Doe',
      address: '123 Main St',
    };

    const order = await service.createOrder(createOrderDto);
    expect(order).toEqual(mockOrder);
    expect(repository.create).toHaveBeenCalledWith(createOrderDto);
    expect(repository.save).toHaveBeenCalledWith(expect.any(Object));
  });

  it('should find an order by ID', async () => {
    const orderId = 1;
    const order = await service.findOne(orderId);
    expect(order).toEqual(mockOrder);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: orderId } });
  });

  it('should return all orders', async () => {
    const orders = await service.findAll();
    expect(orders).toEqual([mockOrder]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should update an order', async () => {
    const updateOrderDto: UpdateOrderDto = {
      productIds: [1, 3],
      totalAmount: 150,
      status: 'Shipped',
      trackingNumber: 'TRACK123',
      customerName: 'Jane Doe',
      address: '456 Elm St',
    };

    const updatedOrder = await service.update(1, updateOrderDto);
    expect(updatedOrder).toEqual(mockOrder);
    expect(repository.update).toHaveBeenCalledWith(1, updateOrderDto);
  });

  it('should remove an order', async () => {
    const orderId = 1;
    const result = await service.remove(orderId);
    expect(result).toEqual({ affected: 1 });
    expect(repository.delete).toHaveBeenCalledWith(orderId);
  });

  // Add more tests for other methods...
});
