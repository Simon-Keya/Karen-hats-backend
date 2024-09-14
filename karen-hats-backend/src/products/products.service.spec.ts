import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto'; // Assuming you have this DTO for filtering
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

describe('ProductsService', () => {
  let productsService: ProductsService;

  const mockProductRepository = {
    save: jest.fn((product: Product) => Promise.resolve({ id: 1, ...product })),
    find: jest.fn(() => Promise.resolve([{ id: 1, name: 'Product 1', description: 'Description 1', price: 100 }])),
    findOne: jest.fn((id: number) => Promise.resolve({ id, name: 'Product 1', description: 'Description 1', price: 100 })),
    update: jest.fn((id: number, product: UpdateProductDto) => Promise.resolve({ id, ...product })),
    remove: jest.fn((id: number) => Promise.resolve({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: 'ProductRepository',
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    productsService = module.get<ProductsService>(ProductsService);
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductDto = { 
        name: 'Product 1', 
        price: 100, 
        description: 'A sample product' // Include the description property
      };
      const result = await productsService.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockProductRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const filterDto: FilterProductsDto = {}; // Provide an empty filter or adjust as necessary
      const result = await productsService.findAll(filterDto);
      expect(result).toEqual([{ id: 1, name: 'Product 1', description: 'Description 1', price: 100 }]);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const result = await productsService.findOne(1);
      expect(result).toEqual({ id: 1, name: 'Product 1', description: 'Description 1', price: 100 });
      expect(mockProductRepository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { name: 'Updated Product', price: 150, description: 'Updated description' };
      const result = await productsService.update(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockProductRepository.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = await productsService.remove(1);
      expect(result).toEqual({ id: 1 });
      expect(mockProductRepository.remove).toHaveBeenCalledWith(1);
    });
  });
});
