import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Create a new product
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // Get all products with optional filters
  @Get()
  async findAll(@Query() filter: FilterProductsDto) {
    return this.productsService.findAll(filter);
  }

  // Get a single product by ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id); // Convert id to number
  }

  // Update a product by ID
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto); // Convert id to number
  }

  // Delete a product by ID
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.productsService.remove(+id); // Convert id to number
  }
}
