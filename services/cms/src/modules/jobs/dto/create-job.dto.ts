import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  status?: string; // e.g., "Open", "Closed"

  @IsOptional()
  @IsDateString()
  expiryDate?: string; // e.g. "2025-12-31T23:59:59Z"
}
