import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';

export class CreateApplicationDto {

  @IsNumber()
  job_id: number;

  @IsNumber()
  candidate_id: number;

  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  cv: string;

  @IsDateString()
  appliedDate: string;

  @IsDateString()
  created_at: string;
}
