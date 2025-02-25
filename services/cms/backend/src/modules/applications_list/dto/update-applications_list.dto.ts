import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationsListDto } from './create-applications_list.dto';

export class UpdateApplicationsListDto extends PartialType(CreateApplicationsListDto) {}
