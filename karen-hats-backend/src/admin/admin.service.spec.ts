import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entity/order.entity';
import { Product } from '../products/entities/product.entity';
import { AdminService } from './admin.service';
import { ManageProductDto } from './dto/manage-product.dto'; // Import the correct DTO

describe('AdminService', () => {
  let service: AdminService;
  let productRepo: Repository<Product>;
  let orderRepo: Repository<Order>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    orderRepo = module.get<Repository<Order>>(getRepositoryToken(Order));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test case for manageProduct method
  it('should manage a product', async () => {
    // Provide valid product details as per the ManageProductDto structure
    const manageProductDto: ManageProductDto = {
      name: 'Test Product',
      price: 100,
      stock: 50,
      description: 'A sample product description',
      category: 'Accessories',
    };

    const result = await service.manageProduct(manageProductDto);
    expect(result).toBeDefined();
  });

  // Add more tests for manageOrder and others
});
