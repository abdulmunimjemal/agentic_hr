import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InterviewResultsService } from './interview-results.service';
import { InterviewResultsController } from './interview-results.controller';
import { InterviewResult, InterviewResultSchema } from './schemas/interview-result.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InterviewResult.name, schema: InterviewResultSchema, collection: 'interview_results' },
    ]),
  ],
  controllers: [InterviewResultsController],
  providers: [InterviewResultsService],
  exports: [InterviewResultsService],
})
export class InterviewResultsModule {}
