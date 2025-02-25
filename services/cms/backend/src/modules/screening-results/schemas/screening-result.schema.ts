import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class ScreeningResult extends Document {

  @Prop()
  app_id: string

  @Prop()
  score: number

  @Prop({ type: Object })
  skills?: Record<string, any>;

  @Prop([String])
  reasoning?: string[];

  @Prop({ type: Object })
  parsed_cv?: Record<string, any>;

  @Prop({ type: Date, default: Date.now })
  created_at: Date;

}

export const ScreeningResultSchema = SchemaFactory.createForClass(ScreeningResult);
