import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScreeningResultsService } from './screening-results.service';
import { ScreeningResultsController } from './screening-results.controller';
import { ScreeningResult, ScreeningResultSchema } from './schemas/screening-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScreeningResult.name, schema: ScreeningResultSchema, collection: 'screening_results'},
    ]),
  ],
  controllers: [ScreeningResultsController],
  providers: [ScreeningResultsService],
  exports: [ScreeningResultsService],
})
export class ScreeningResultsModule {}
