import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ApplicationsList extends Document {
  @Prop({ required: true })
  job_id: number;

  @Prop()
  name: string;

  @Prop()
  app_id?: string;

  @Prop()
  cv: string;

  @Prop()
  hiring_decision: string;

  @Prop({ type: Date, default: Date.now })
  date: Date;

  @Prop({
    type: {
      screening: { type: [String], default: [] },
      interview: { type: [String], default: [] },
    },
    default: {},
  })
  reasoning: {
    screening: string[];
    interview: string[];
  };

  // Now physically stored in MongoDB (default to "pending")
  @Prop({ default: 'pending' })
  screeningStatus: string;

  @Prop({ default: 'pending' })
  interviewStatus: string;
}

export const ApplicationsListSchema = SchemaFactory.createForClass(ApplicationsList);

// Optional: pre-save hook to auto-update the statuses
ApplicationsListSchema.pre('save', function (next) {
  // If there's at least one screening note, set "completed", else "pending"
  if (this.reasoning?.screening?.length) {
    this.screeningStatus = 'completed';
  } else {
    this.screeningStatus = 'pending';
  }

  // If there's at least one interview note, set "completed", else "pending"
  if (this.reasoning?.interview?.length) {
    this.interviewStatus = 'completed';
  } else {
    this.interviewStatus = 'pending';
  }

  next();
});
