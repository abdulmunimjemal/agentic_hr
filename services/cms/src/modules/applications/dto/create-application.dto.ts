import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { WorkflowStatus, InterviewAssessmentEnum } from '../application-status.enums';

export class CreateApplicationDto {
  // If you're referencing MongoDB ObjectIds, use @IsString()
  @IsNumber()
  job_id: number;

  @IsString()
  name: string;

  @IsString()
  cv: string;

}
