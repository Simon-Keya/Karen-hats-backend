import { IsNotEmpty, IsString } from 'class-validator';

export class ManageOrderDto {
  @IsNotEmpty()
  @IsString()
  readonly status: string;

  @IsNotEmpty()
  @IsString()
  readonly trackingNumber: string;
}
