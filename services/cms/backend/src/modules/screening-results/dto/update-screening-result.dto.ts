import { PartialType } from '@nestjs/mapped-types';
import { CreateScreeningResultDto } from './create-screening-result.dto';

export class UpdateScreeningResultDto extends PartialType(CreateScreeningResultDto) {}
