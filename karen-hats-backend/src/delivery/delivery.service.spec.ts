import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';
import { Delivery } from './entities/delivery.entity';

describe('DeliveryService', () => {
  let service: DeliveryService;
  let repo: Repository<Delivery>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryService,
        {
          provide: getRepositoryToken(Delivery),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            // Add any other repository methods you need to mock here
          },
        },
      ],
    }).compile();

    service = module.get<DeliveryService>(DeliveryService);
    repo = module.get<Repository<Delivery>>(getRepositoryToken(Delivery));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a delivery', async () => {
    const createDeliveryDto: CreateDeliveryDto = { 
      orderId: '123', 
      address: '123 Main St', 
      status: 'Pending' 
    };

    // Mock the create and save methods
    const mockDelivery: Delivery = { 
      id: '1', 
      createdAt: new Date(), // Adding the createdAt property
      ...createDeliveryDto 
    };
    
    jest.spyOn(repo, 'create').mockReturnValue(mockDelivery);
    jest.spyOn(repo, 'save').mockResolvedValue(mockDelivery);

    const result = await service.createDelivery(createDeliveryDto);
    expect(result).toBeDefined();
    expect(result).toEqual(mockDelivery);
    expect(repo.create).toHaveBeenCalledWith(createDeliveryDto);
    expect(repo.save).toHaveBeenCalledWith(mockDelivery);
  });

  // Add more tests for findAll, findOne, update, remove as needed
});
