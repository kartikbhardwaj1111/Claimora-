import { IsNotEmpty, IsNumber, IsString, IsEmail, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClaimDto {
  @IsNotEmpty()
  @IsString()
  patientName: string;

  @IsNotEmpty()
  @IsEmail()
  patientEmail: string;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Claim amount must be greater than zero' })
  claimAmount: number;

  @IsNotEmpty()
  @IsString()
  description: string;
}
