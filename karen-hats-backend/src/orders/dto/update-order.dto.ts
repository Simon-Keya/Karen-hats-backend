import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  readonly productIds?: number[];

  @IsOptional()
  @IsNumber()
  readonly totalAmount?: number;

  @IsOptional()
  @IsString()
  readonly status?: string;

  @IsOptional()
  @IsString()
  readonly trackingNumber?: string;

  @IsOptional()
  @IsString()
  readonly customerName?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;
}
