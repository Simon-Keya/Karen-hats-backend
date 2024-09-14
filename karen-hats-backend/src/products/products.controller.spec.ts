import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto'; // Import the FilterProductsDto
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let productsController: ProductsController;
  let productsService: ProductsService;

  const mockProductsService = {
    create: jest.fn((dto: CreateProductDto) => ({
      id: 1,
      ...dto,
    })),
    findAll: jest.fn((filter: FilterProductsDto) => [  // Include the filter argument
      { id: 1, name: 'Product 1', description: 'Description 1', price: 100 },
      { id: 2, name: 'Product 2', description: 'Description 2', price: 200 },
    ]),
    findOne: jest.fn((id: string) => ({
      id,
      name: 'Product 1',
      description: 'Description 1',
      price: 100,
    })),
    update: jest.fn((id: string, dto: UpdateProductDto) => ({
      id,
      ...dto,
    })),
    remove: jest.fn((id: string) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    })
      .overrideProvider(ProductsService)
      .useValue(mockProductsService)
      .compile();

    productsController = module.get<ProductsController>(ProductsController);
    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = { 
        name: 'Product 1', 
        price: 100, 
        description: 'Description 1' 
      };
      const result = await productsController.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockProductsService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const filterDto: FilterProductsDto = { search: 'Product', minPrice: 50, maxPrice: 200 }; // Mock the filter DTO
      const result = await productsController.findAll(filterDto);  // Pass the filter DTO
      expect(result).toEqual([
        { id: 1, name: 'Product 1', description: 'Description 1', price: 100 },
        { id: 2, name: 'Product 2', description: 'Description 2', price: 200 },
      ]);
      expect(mockProductsService.findAll).toHaveBeenCalledWith(filterDto); // Ensure the filter is passed
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const result = await productsController.findOne('1');
      expect(result).toEqual({ 
        id: '1', 
        name: 'Product 1', 
        description: 'Description 1', 
        price: 100 
      });
      expect(mockProductsService.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { name: 'Updated Product', description: 'Updated Description', price: 150 };
      const result = await productsController.update('1', dto);
      expect(result).toEqual({ id: '1', ...dto });
      expect(mockProductsService.update).toHaveBeenCalledWith('1', dto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = await productsController.remove('1');
      expect(result).toEqual({ id: '1' });
      expect(mockProductsService.remove).toHaveBeenCalledWith('1');
    });
  });
});
