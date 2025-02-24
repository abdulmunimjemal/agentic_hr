import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as AutoInc from 'mongoose-plugin-autoinc';

@Schema()
export class Job extends Document {

  @Prop()
  job_id: number;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'Open' })
  status: string; // "Open" or "Closed"

  // Optional array of Application references if you want
  @Prop({ type: [Types.ObjectId], ref: 'Application', default: [] })
  applications: Types.ObjectId[];

  /**
   * The date this job was posted
   * Defaults to the current time
   */
  @Prop({ type: Date, default: Date.now })
  postDate: Date;

  /**
   * The date this job expires (optional)
   * You can set it in the DTO if needed
   */
  @Prop({ type: Date })
  expiryDate?: Date;
}

export const JobSchema = SchemaFactory.createForClass(Job);

JobSchema.plugin(AutoInc.autoIncrement, {
  model: 'Job',        // The name of the model (matches your Mongoose model name)
  field: 'job_id',     // The field to increment
  startAt: 1,          // Starting value
  incrementBy: 1,      // Increment step
});