import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApplicationsListService } from './applications_list.service';
import { CreateApplicationsListDto } from './dto/create-applications_list.dto';
import { UpdateApplicationsListDto } from './dto/update-applications_list.dto';

@Controller('applications_list')
export class ApplicationsListController {
  constructor(private readonly applicationsListService: ApplicationsListService) {}

  @Post()
  create(@Body() createApplicationListDto: CreateApplicationsListDto) {
    return this.applicationsListService.create(createApplicationListDto);
  }

  @Get()
  findAll() {
    return this.applicationsListService.findAll();
  }

  @Get(':jobId')
  findOne(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.applicationsListService.findOne(jobId);
  }

  @Patch(':jobId')
  update(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() updateApplicationListDto: UpdateApplicationsListDto,
  ) {
    return this.applicationsListService.update(jobId, updateApplicationListDto);
  }

  @Delete(':jobId')
  remove(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.applicationsListService.remove(jobId);
  }
}
