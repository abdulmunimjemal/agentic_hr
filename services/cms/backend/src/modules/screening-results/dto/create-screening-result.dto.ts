import { IsString, IsOptional, IsArray, IsObject } from 'class-validator';

export class CreateScreeningResultDto {
  @IsString()
  name: string; // e.g., the candidate's name

  @IsOptional()
  @IsString()
  position?: string; // e.g., "Engineer"

  // If 'skills' is an array of strings or objects, adapt accordingly
  @IsOptional()
  @IsArray()
  skills?: string[];

  // If 'reasoning' is an array or object
  @IsOptional()
  @IsArray()
  reasoning?: string[];

  // If you store parsed_cv as an object
  @IsOptional()
  @IsObject()
  parsed_cv?: Record<string, any>;

  // etc. (any other fields from your screenshot)
}
