import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class InterviewResult extends Document {

  @Prop({ required: true, unique: true })
  interview_id: string;

  @Prop()
  user_info: string;

  @Prop()
  role_info: string;

  @Prop()
  reasoning: string;

  @Prop()
  hiring_decision: string;

  @Prop({ type: Object })
  skills?: Record<string, any>;

  @Prop({ type: [String] })
  conversation_history: string[];
}

export const InterviewResultSchema = SchemaFactory.createForClass(InterviewResult);
