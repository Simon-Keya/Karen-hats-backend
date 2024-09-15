import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let ordersController: OrdersController;
  let ordersService: OrdersService;

  const mockOrdersService = {
    createOrder: jest.fn((dto) => Promise.resolve({ id: 1, ...dto })),
    findAllOrdersByUser: jest.fn(() => Promise.resolve([{ id: 1, productIds: [1], totalAmount: 100, status: 'Pending', customerName: 'John', address: '123 Street' }])), // Updated method name
    findOne: jest.fn((id) => Promise.resolve({ id, productIds: [1], totalAmount: 100, status: 'Pending', customerName: 'John', address: '123 Street' })),
    updateStatus: jest.fn((id, status) => Promise.resolve({ id, status })), // Updated method name
    remove: jest.fn((id) => Promise.resolve({ id })), // Updated method name
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    ordersController = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const dto: CreateOrderDto = {
        productIds: [1], // Corrected to use productIds
        totalAmount: 100,
        status: 'Pending',
        trackingNumber: null,
        customerName: 'John',
        address: '123 Street',
      };
      const result = await ordersController.createOrder(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAllOrders', () => {
    it('should return all orders', async () => {
      const result = await ordersController.findAllOrders('1');
      expect(result).toEqual([{ id: 1, productIds: [1], totalAmount: 100, status: 'Pending', customerName: 'John', address: '123 Street' }]);
      expect(mockOrdersService.findAllOrdersByUser).toHaveBeenCalled(); // Updated method name
    });
  });

  describe('findOneOrder', () => {
    it('should return a single order', async () => {
      const result = await ordersController.findOneOrder('1');
      expect(result).toEqual({ id: 1, productIds: [1], totalAmount: 100, status: 'Pending', customerName: 'John', address: '123 Street' });
      expect(mockOrdersService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update an order status', async () => {
      const status = 'shipped'; // String for the status
      const result = await ordersController.updateOrderStatus('1', status);
      expect(result).toEqual({ id: 1, status });
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(1, status); // Updated method name
    });
  });

  describe('deleteOrder', () => {
    it('should remove an order', async () => {
      const result = await ordersController.deleteOrder('1');
      expect(result).toEqual({ id: 1 });
      expect(mockOrdersService.remove).toHaveBeenCalledWith(1); // Updated method name
    });
  });
});
