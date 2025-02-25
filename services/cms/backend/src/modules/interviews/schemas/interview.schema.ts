import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Interview extends Document {

  @Prop({ required: true, unique: true })
  interview_id: string;

  @Prop({ type: [String] })
  user_answers: string[];

  @Prop()
  user_info: string; 

  @Prop()
  role_info: string;

  @Prop()
  user_email: string;

  @Prop({ type: Object })
  skills: Record<string, any>;

  @Prop({ type: [String] })
  conversation_history: string[];
}

export const InterviewSchema = SchemaFactory.createForClass(Interview);
