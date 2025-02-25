import { PartialType } from '@nestjs/mapped-types';
import { CreateInterviewResultDto } from './create-interview-result.dto';

export class UpdateInterviewResultDto extends PartialType(CreateInterviewResultDto) {}
