import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as AutoInc from 'mongoose-plugin-autoinc';

@Schema()
export class Candidate extends Document {

  @Prop()
  candidate_id: number;

  @Prop()
  name: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  phone?: string;

  @Prop({ type: [Types.ObjectId], ref: 'Application', default: [] })
  applications: Types.ObjectId[];
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate);

CandidateSchema.plugin(AutoInc.autoIncrement, {
  model: 'Candidate',
  field: 'candidate_id',
  startAt: 1,
  incrementBy: 1,
});