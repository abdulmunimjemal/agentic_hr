import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  findAll() {
    return this.applicationsService.findAll();
  }

  @Get(':jobId')
  findOne(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.applicationsService.findOne(jobId);
  }

  @Patch(':jobId')
  update(
    @Param('jobId', ParseIntPipe) jobId: number,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationsService.update(jobId, updateApplicationDto);
  }

  @Delete(':jobId')
  remove(@Param('jobId', ParseIntPipe) jobId: number) {
    return this.applicationsService.remove(jobId);
  }
}
