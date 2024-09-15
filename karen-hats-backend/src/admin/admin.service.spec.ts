import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/entity/order.entity';
import { Product } from '../products/entities/product.entity';
import { AdminService } from './admin.service';
import { ManageOrderDto } from './dto/manage-order.dto';
import { ManageProductDto } from './dto/manage-product.dto';
import { Admin } from './entities/admin.entity';

describe('AdminService', () => {
  let service: AdminService;
  let productRepo: Repository<Product>;
  let orderRepo: Repository<Order>;
  let adminRepo: Repository<Admin>;

  const mockProductRepo = {
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
  };

  const mockOrderRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  const mockAdminRepo = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepo,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
        {
          provide: getRepositoryToken(Admin),
          useValue: mockAdminRepo,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    productRepo = module.get<Repository<Product>>(getRepositoryToken(Product));
    orderRepo = module.get<Repository<Order>>(getRepositoryToken(Order));
    adminRepo = module.get<Repository<Admin>>(getRepositoryToken(Admin));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Test case for managing a product
  it('should manage a product', async () => {
    const manageProductDto: ManageProductDto = {
      name: 'Test Product',
      price: 100,
      stock: 50,
      description: 'A sample product description',
      category: 'Accessories',
    };

    const product = { ...manageProductDto, id: 1 }; // Mocked product with ID

    mockProductRepo.save.mockResolvedValue(product as any);
    mockProductRepo.preload.mockResolvedValue(product as any);

    const result = await service.manageProduct(manageProductDto);
    expect(result).toBeDefined();
    expect(result.product).toEqual(product);
  });

  // Test case for creating a product
  it('should create a new product', async () => {
    const manageProductDto: ManageProductDto = {
      name: 'New Product',
      price: 150,
      stock: 30,
      description: 'New product description',
      category: 'Electronics',
    };

    const product = { ...manageProductDto, id: 2 }; // Mocked created product with ID

    mockProductRepo.create.mockReturnValue(product as any);
    mockProductRepo.save.mockResolvedValue(product as any);

    const result = await service.manageProduct(manageProductDto);
    expect(result.product).toEqual(product);
  });

  // Test case for managing an order
  it('should manage an order', async () => {
    const orderId = '1';
    const manageOrderDto: ManageOrderDto = {
      id: 1, // Add the required id field
      status: 'shipped',
      trackingNumber: 'ABC123',
    };

    const order = { 
      id: 1, 
      status: 'pending', 
      trackingNumber: null, 
      user: { 
        id: 1, 
        username: 'testuser', 
        email: 'testuser@example.com',
        password: 'password', // Include the missing properties
        createdAt: new Date(),
        updatedAt: new Date(),
        orders: [], // Mock orders array if applicable
      } as any, // Ensure user is cast to User type
      productIds: [1], // Mock product IDs
      totalAmount: 100, 
      createdAt: new Date(), 
      updatedAt: new Date()
    }; // Mocked existing order with all required fields

    mockOrderRepo.findOneBy.mockResolvedValue(order as any);
    mockOrderRepo.save.mockResolvedValue({ ...order, ...manageOrderDto });

    const result = await service.manageOrder(orderId, manageOrderDto);
    expect(result).toBeDefined();
    expect(result.order.status).toEqual('shipped');
    expect(result.order.trackingNumber).toEqual('ABC123');
  });

  // Test case for handling non-existing order
  it('should throw NotFoundException if order is not found', async () => {
    const orderId = '999'; // Non-existing order ID
    const manageOrderDto: ManageOrderDto = { 
      id: 999, // Add the required id field
      status: 'delivered', 
      trackingNumber: 'XYZ789' 
    };

    mockOrderRepo.findOneBy.mockResolvedValue(null);

    await expect(service.manageOrder(orderId, manageOrderDto)).rejects.toThrowError(
      new NotFoundException(`Order with ID ${parseInt(orderId, 10)} not found`),
    );
  });
});
