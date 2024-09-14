import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ManageOrderDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;  // Use @IsNumber() instead of @IsString() for the ID if it's numeric.

  @IsNotEmpty()  // Adding this ensures that the status field must not be empty
  @IsString()
  status: string;

  @IsOptional()
  @IsString()
  trackingNumber?: string;  // Optional tracking number if available.
}
