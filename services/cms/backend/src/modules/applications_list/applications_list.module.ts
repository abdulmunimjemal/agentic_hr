import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationsListService } from './applications_list.service';
import { ApplicationsList, ApplicationsListSchema } from './schema/applications_list.schema';
import { ApplicationsListController } from './applications_list.controller';
import { ApplicationsModule } from '../applications/applications.module';
import { ScreeningResultsModule } from '../screening-results/screening-results.module';
import { InterviewsModule } from '../interviews/interviews.module';
import { InterviewResultsModule } from '../interview-results/interview-results.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: ApplicationsList.name, schema: ApplicationsListSchema, collection: 'applications_list'}]),
    ApplicationsModule,
    ScreeningResultsModule,
    InterviewsModule,
    InterviewResultsModule,
  ],
  controllers: [ApplicationsListController],
  providers: [ApplicationsListService],
  exports: [ApplicationsListService],
})
export class ApplicationsListModule {}
