// src/modules/applications/schemas/application.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { WorkflowStatus, InterviewAssessmentEnum } from '../application-status.enums';

@Schema()
export class Application extends Document {
  
  @Prop({ required: true })
  job_id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  cv: string;

  // Track when the candidate applied
  @Prop({ type: Date, default: Date.now })
  date: Date;
}

// Generate the Mongoose schema
export const ApplicationSchema = SchemaFactory.createForClass(Application);
