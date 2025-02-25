// applications_list.service.ts
import { Injectable } from '@nestjs/common';
import { ApplicationsService } from '../applications/applications.service';
import { ScreeningResultsService } from '../screening-results/screening-results.service';
import { InterviewsService } from '../interviews/interviews.service';
import { InterviewResultsService } from '../interview-results/interview-results.service';
import { ApplicationsList } from './schema/applications_list.schema';
import { Application } from '../applications/schemas/application.schema';

@Injectable()
export class ApplicationsListService {
  constructor(
    private readonly applicationsService: ApplicationsService,
    private readonly screeningResultService: ScreeningResultsService,
    private readonly interviewsService: InterviewsService,
    private readonly interviewResultsService: InterviewResultsService,
  ) {}

  async findByJobId(jobId: number): Promise<Partial<ApplicationsList>[]> {
    // 1. Fetch all applications for the given job id
    const applications: Application[] = await this.applicationsService.findByJobId(jobId);

    // 2. For each application, gather data from the other services
    const unifiedApplications = await Promise.all(
      applications.map(async (app) => {
        // --- Screening Result ---
        let screeningResult;
      
        try {
          // Using the application's _id (converted to string) as the identifier
          screeningResult = await this.screeningResultService.findOne(app._id.toString());
        } catch (err) {
          screeningResult = null;
        }

        // --- Interview ---
        let interview;
        try {
          interview = await this.interviewsService.findOne(app._id.toString());
        } catch (err) {
          interview = null;
        }

        // --- Interview Result ---
        let interviewResult;
        if (interview && interview.interview_id) {
          try {
            interviewResult = await this.interviewResultsService.findOne(interview.interview_id);
          } catch (err) {
            interviewResult = null;
          }
        }

        // --- Build the unified response object ---
        const unifiedApp: Partial<ApplicationsList> = {
          job_id: app.job_id,
          name: app.name,
          app_id: app._id.toString(),
          cv: app.cv,
          hiring_decision: interviewResult ? interviewResult.hiring_decision : '',
          date: app.appliedDate, // using appliedDate as the date field
          reasoning: {
            screening: screeningResult && screeningResult.score ? [screeningResult.score] : [],
            // Wrap the interview reasoning in an array if available
            interview: interviewResult && interviewResult.score ? [interviewResult.score] : [],
          },
          screeningStatus: screeningResult ? 'completed' : 'pending',
          // If an interview is found then "invited"; if an interview result is also found then "completed"
          interviewStatus: interview ? (interviewResult ? 'completed' : 'invited') : 'pending',
        };

        return unifiedApp;
      }),
    );

    return unifiedApplications;
  }
}
