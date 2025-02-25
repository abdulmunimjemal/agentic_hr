import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Application extends Document {
  
  @Prop({ required: true })
  job_id: number;

  @Prop()
  name: string;

  @Prop()
  email: string;
  
  @Prop()
  cv: string;

  @Prop({ type: Date, default: Date.now })
  appliedDate: Date;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;
}

export const ApplicationsSchema = SchemaFactory.createForClass(Application);
