import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Job extends Document {

  @Prop()
  job_id: number;

  @Prop({required: true})
  title: string;

  @Prop()
  description: string;

  @Prop({ default: 'Open' })
  status: string; 

  @Prop({ type: [Types.ObjectId], ref: 'Application', default: [] })
  applications: Types.ObjectId[];

  @Prop({ type: Date, default: Date.now })
  postDate: Date;  
}

export const JobSchema = SchemaFactory.createForClass(Job);