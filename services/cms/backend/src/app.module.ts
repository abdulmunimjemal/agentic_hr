import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsListModule } from './modules/applications_list/applications_list.module';
import { InterviewResultsModule } from './modules/interview-results/interview-results.module';
import { ScreeningResultsModule } from './modules/screening-results/screening-results.module';
import { InterviewsModule } from './modules/interviews/interviews.module';

@Module({
  imports: [
    // Loads .env variables
    ConfigModule.forRoot({ isGlobal: true }),
    
    // TypeORM config
    MongooseModule.forRoot(process.env.MONGO_URI),
    
    JobsModule,
    ApplicationsModule,
    CandidatesModule,
    ApplicationsListModule,
    InterviewResultsModule,
    ScreeningResultsModule,
    InterviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
