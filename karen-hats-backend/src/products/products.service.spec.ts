import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

const mockProduct = {
  id: 1,
  name: 'Product 1',
  description: 'Description 1',
  price: 100,
};

const mockQueryBuilder = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockProduct]),
};

const mockProductRepository = {
  create: jest.fn((dto: CreateProductDto) => ({ id: 1, ...dto })),
  save: jest.fn((product: Product) => Promise.resolve({ id: 1, ...product })),
  find: jest.fn(() => Promise.resolve([mockProduct])),
  findOne: jest.fn((options: any) => {
    if (options.where.id === 1) {
      return Promise.resolve(mockProduct);
    }
    return Promise.resolve(null);
  }),
  preload: jest.fn((dto: UpdateProductDto) => Promise.resolve({ id: 1, ...dto })),
  remove: jest.fn((product: Product) => Promise.resolve(product)),
  createQueryBuilder: jest.fn(() => mockQueryBuilder), // Add the createQueryBuilder mock
};

describe('ProductsService', () => {
  let productsService: ProductsService;

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
      const dto: CreateProductDto = { name: 'Product 1', price: 100, description: 'A sample product' };
      const result = await productsService.create(dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockProductRepository.create).toHaveBeenCalledWith(dto);
      expect(mockProductRepository.save).toHaveBeenCalledWith({ id: 1, ...dto });
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const filterDto: FilterProductsDto = {};
      const result = await productsService.findAll(filterDto);
      expect(result).toEqual([mockProduct]);
      expect(mockProductRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(mockQueryBuilder.getMany).toHaveBeenCalled(); // Check that getMany was called
    });
  });

  describe('findOne', () => {
    it('should return a product by ID', async () => {
      const result = await productsService.findOne(1);
      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw a NotFoundException if product is not found', async () => {
      await expect(productsService.findOne(2)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductDto = { name: 'Updated Product', price: 150, description: 'Updated Description' };
      const result = await productsService.update(1, dto);
      expect(result).toEqual({ id: 1, ...dto });
      expect(mockProductRepository.preload).toHaveBeenCalledWith({ id: 1, ...dto });
      expect(mockProductRepository.save).toHaveBeenCalledWith({ id: 1, ...dto });
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = await productsService.remove(1);
      expect(result).toEqual({ message: `Product #1 removed successfully` });
      expect(mockProductRepository.remove).toHaveBeenCalledWith(mockProduct); // Call with full product object
    });

    it('should throw a NotFoundException if product is not found', async () => {
      jest.spyOn(mockProductRepository, 'findOne').mockResolvedValueOnce(null); // Simulate not found
      await expect(productsService.remove(2)).rejects.toThrow(NotFoundException);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { id: 2 } });
    });
  });
});
