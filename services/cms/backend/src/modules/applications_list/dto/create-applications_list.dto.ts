import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ReasoningDto } from './reasoning.dto';

export class CreateApplicationsListDto {

  @IsNumber()
  job_id: number;

  @IsNumber()
  candidate_id: number;

  @IsString()
  name: string

  @IsString()
  cv: string

  @IsString()
  hiring_decision: string; 

  @IsDateString()
  date: string;

  @IsString()
  interviewStatus: string;

  @IsString()
  screeningStatus: string;

  @ValidateNested()
  @Type(() => ReasoningDto)
  reasoning?: ReasoningDto;
}
