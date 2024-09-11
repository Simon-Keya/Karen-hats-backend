import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ManageProductDto {
  @IsOptional() // Optional for new product creation
  @IsNumber()
  readonly id?: number;

  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly stock: number;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  readonly category: string;
}
