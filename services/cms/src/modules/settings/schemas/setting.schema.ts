// src/modules/settings/schemas/setting.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  // Enable Mongoose timestamps, mapping them to createdAt/updatedAt
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
})
export class Setting extends Document {
  // Mongoose auto-generates _id as ObjectId, so no numeric id needed

  @Prop({ unique: true })
  key: string; // e.g. "notification_email", "app_mode"

  @Prop()
  value: string; // e.g. "on", "off", or any string

  @Prop()
  description?: string; // optional explanation

  // createdAt/updatedAt will be auto-managed by Mongoose.
  // If you want them typed, you can add them:
  createdAt: Date;
  updatedAt: Date;
}

// Generate the Mongoose schema
export const SettingSchema = SchemaFactory.createForClass(Setting);
