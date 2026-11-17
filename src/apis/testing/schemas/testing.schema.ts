import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TestingDocument = HydratedDocument<Testing>;

@Schema({ collection: 'testing', timestamps: true })
export class Testing {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  isDeleted: boolean;
}

export const TestingSchema = SchemaFactory.createForClass(Testing);
TestingSchema.index({ name: 1 }, { unique: true });
