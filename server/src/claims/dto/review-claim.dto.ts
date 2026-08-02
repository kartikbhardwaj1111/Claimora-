import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewClaimDto {
  @IsNotEmpty()
  @IsEnum(['Approved', 'Rejected'], { message: 'Status must be Approved or Rejected' })
  status: 'Approved' | 'Rejected';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  approvedAmount?: number;

  @IsOptional()
  @IsString()
  insurerComments?: string;
}
