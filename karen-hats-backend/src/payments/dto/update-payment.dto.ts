import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  readonly amount?: number;

  @IsOptional()
  @IsString()
  readonly paymentMethod?: string;  // 'method' is now 'paymentMethod'

  @IsOptional()
  @IsString()
  readonly status?: string;  // You might want to track the status of the payment (e.g., "Paid", "Pending", etc.)
}
