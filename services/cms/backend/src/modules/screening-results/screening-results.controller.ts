import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScreeningResultsService } from './screening-results.service';
import { CreateScreeningResultDto } from './dto/create-screening-result.dto';
import { UpdateScreeningResultDto } from './dto/update-screening-result.dto';

@Controller('screening_results')
export class ScreeningResultsController {
  constructor(private readonly screeningResultsService: ScreeningResultsService) {}

  @Post()
  create(@Body() createScreeningResultDto: CreateScreeningResultDto) {
    return this.screeningResultsService.create(createScreeningResultDto);
  }

  @Get()
  findAll() {
    return this.screeningResultsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.screeningResultsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateScreeningResultDto: UpdateScreeningResultDto,
  ) {
    return this.screeningResultsService.update(id, updateScreeningResultDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.screeningResultsService.remove(id);
  }
}
