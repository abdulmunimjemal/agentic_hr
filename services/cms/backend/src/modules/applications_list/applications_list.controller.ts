import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApplicationsListService } from './applications_list.service';

@Controller('applications_list')
export class ApplicationsListController {
  constructor(private readonly applicationsListService: ApplicationsListService) {}

  @Get(':jobId')
  async findByJobId(@Param('jobId', ParseIntPipe) jobId: number) {
    return await this.applicationsListService.findByJobId(jobId);
  }
}