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

  create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  findAll(filter: FilterProductsDto) {
    const query = this.productRepository.createQueryBuilder('product');

    if (filter.name) {
      query.andWhere('product.name LIKE :name', { name: `%${filter.name}%` });
    }

    if (filter.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: filter.minPrice });
    }

    if (filter.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filter.maxPrice });
    }

    if (filter.category) {
      query.andWhere('product.category = :category', { category: filter.category });
    }

    return query.getMany();
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

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

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
