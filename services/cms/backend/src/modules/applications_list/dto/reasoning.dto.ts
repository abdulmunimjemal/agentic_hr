import { IsArray, IsOptional, IsString } from 'class-validator';

export class ReasoningDto {
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  screening?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interview?: string[];
}
