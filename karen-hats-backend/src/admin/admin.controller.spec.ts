import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ManageProductDto } from './dto/manage-product.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let service: AdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: {
            manageProduct: jest.fn(),
            manageOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
    service = module.get<AdminService>(AdminService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should manage a product', async () => {
    // Provide the required fields for the DTO
    const dto: ManageProductDto = {
      name: 'Test Product',
      price: 100,
      stock: 50,
      description: 'A sample product description',
      category: 'Accessories',
    };

    await controller.manageProduct(dto);
    expect(service.manageProduct).toHaveBeenCalledWith(dto);
  });

  // Add more tests for other controller methods
});
