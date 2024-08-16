import { IsOptional, IsString } from 'class-validator';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @IsString()
  readonly status?: string;
}
