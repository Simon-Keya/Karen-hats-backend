import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

describe('DeliveryController', () => {
  let controller: DeliveryController;
  let service: DeliveryService;

  const mockDeliveryService = {
    createDelivery: jest.fn((dto) => Promise.resolve({ id: '1', ...dto })),
    getAllDeliveries: jest.fn(() => Promise.resolve([{ id: '1', orderId: '123', address: '123 Main St', status: 'Pending' }])),
    getDelivery: jest.fn((id) => Promise.resolve({ id, orderId: '123', address: '123 Main St', status: 'Pending' })),
    updateDelivery: jest.fn((id, dto) => Promise.resolve({ id, ...dto })),
    deleteDelivery: jest.fn((id) => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryController],
      providers: [
        {
          provide: DeliveryService,
          useValue: mockDeliveryService,
        },
      ],
    }).compile();

    controller = module.get<DeliveryController>(DeliveryController);
    service = module.get<DeliveryService>(DeliveryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new delivery', async () => {
    const dto: CreateDeliveryDto = { 
      orderId: '123', 
      address: '123 Main St', 
      status: 'Pending' 
    };
    const result = await controller.createDelivery(dto);
    expect(result).toEqual({ id: '1', ...dto });
    expect(service.createDelivery).toHaveBeenCalledWith(dto);
  });

  // Add more tests for findAll, findOne, update, and remove as needed
});
