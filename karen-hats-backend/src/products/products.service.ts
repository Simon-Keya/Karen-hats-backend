import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create a new product
  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  // Find all products with optional filtering
  findAll(filter: FilterProductsDto) {
    const query = this.productRepository.createQueryBuilder('product');

    // Filter by product name
    if (filter.name) {
      query.andWhere('product.name LIKE :name', { name: `%${filter.name}%` });
    }

    // Filter by minimum price
    if (filter.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
    }

    // Filter by maximum price
    if (filter.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    // Filter by category
    if (filter.category) {
      query.andWhere('product.category = :category', { category: filter.category });
    }

    // Sort by creation date if needed (example of sorting)
    query.orderBy('product.createdAt', 'DESC');

    return query.getMany();
  }

  // Find a single product by its ID
  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  // Update a product by its ID
  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return this.productRepository.save(product);
  }

  // Remove a product by its ID
  async remove(id: number) {
    const product = await this.findOne(id); // Ensure the product exists before deletion
    await this.productRepository.remove(product);
    return { message: `Product #${id} removed successfully` };
  }
}
