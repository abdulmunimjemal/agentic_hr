import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('job_id') job_id: number) {
    return this.jobsService.findOne(job_id);
  }

  @Patch(':id')
  update(@Param('job_id') job_id: number, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(job_id, updateJobDto);
  }

  @Delete(':id')
  remove(@Param('job_id') job_id: number) {
    return this.jobsService.remove(job_id);
  }
}
