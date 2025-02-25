import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InterviewResultsService } from './interview-results.service';
import { CreateInterviewResultDto } from './dto/create-interview-result.dto';
import { UpdateInterviewResultDto } from './dto/update-interview-result.dto';

@Controller('interview_results')
export class InterviewResultsController {
  constructor(private readonly interviewResultsService: InterviewResultsService) {}

  @Post()
  create(@Body() createInterviewResultDto: CreateInterviewResultDto) {
    return this.interviewResultsService.create(createInterviewResultDto);
  }

  @Get()
  findAll() {
    return this.interviewResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.interviewResultsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInterviewResultDto: UpdateInterviewResultDto) {
    return this.interviewResultsService.update(id, updateInterviewResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.interviewResultsService.remove(id);
  }
}
