import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  readonly amount?: number;

  @IsOptional()
  @IsString()
  readonly paymentMethod?: string;

  @IsOptional()
  @IsString()
  readonly status?: string;
}
