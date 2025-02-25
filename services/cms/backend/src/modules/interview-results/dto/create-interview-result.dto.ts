import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// Adjust fields as needed (e.g., conversationHistory array, skill analysis, etc.)
export class CreateInterviewResultDto {
  @IsString()
  score: string;

  @IsString()
  reason: string;

  // Possibly a final hiring decision from the microservice
  @IsString()
  @IsOptional()
  hiringDecision?: string;

  @IsNumber()
  @IsOptional()
  numberOfQuestions?: number;

  // If you store conversation transcripts, might be an array of strings or objects
  @IsArray()
  @IsOptional()
  conversationHistory?: string[];
}
