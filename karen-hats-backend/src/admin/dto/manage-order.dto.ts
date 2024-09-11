import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ManageOrderDto {
  @IsNotEmpty()
  @IsString()
  id: number;
  readonly status: string;

  @IsOptional() // Made optional in case it's not available initially
  @IsString()
  readonly trackingNumber?: string;
}
