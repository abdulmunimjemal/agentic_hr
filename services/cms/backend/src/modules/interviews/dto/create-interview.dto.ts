import { IsString, IsOptional, IsNumber, IsArray, IsObject } from 'class-validator';

export class CreateInterviewDto {
  @IsOptional()
  @IsString()
  required_level?: string; // e.g. "intermediate"

  @IsOptional()
  @IsNumber()
  rating?: number; // e.g. 8

  @IsOptional()
  @IsNumber()
  questions_asked?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  user_info?: string; // e.g. "Abdulnur has 3 years..."

  @IsOptional()
  @IsString()
  role_info?: string; // e.g. "Software Engineer"

  @IsOptional()
  @IsString()
  user_name?: string;

  @IsOptional()
  @IsString()
  user_email?: string;

  // If 'skills' is an object with e.g. { Python: { ... } }, treat it as a free-form object
  @IsOptional()
  @IsObject()
  skills?: Record<string, any>;

  // If conversation_history is an array of strings or a more complex structure
  @IsOptional()
  @IsArray()
  conversation_history?: string[];
}
