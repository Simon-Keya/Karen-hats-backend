// src/orders/dto/create-order.dto.ts

import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsArray() // Expecting an array of product IDs
  @IsNumber({}, { each: true }) // Ensure each item in the array is a number
  readonly productIds: number[];

  @IsNotEmpty()
  @IsNumber()
  readonly totalAmount: number; // Make sure to include totalAmount as it's required

  @IsNotEmpty()
  @IsString()
  readonly status: string; // Optional: You can set a default value in the entity

  @IsString()
  readonly trackingNumber?: string; // Optional: Tracking number can be provided

  @IsNotEmpty()
  @IsString()
  readonly customerName: string; // Ensure customerName is part of the order

  @IsNotEmpty()
  @IsString()
  readonly address: string; // Address should be required
}
