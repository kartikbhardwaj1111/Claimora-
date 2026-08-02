import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from './user.schema';

export type ClaimDocument = Claim & Document;

@Schema({ timestamps: true })
export class Claim {
  @Prop({ required: true, unique: true })
  claimId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  patientId: User;

  @Prop({ required: true })
  patientName: string;

  @Prop({ required: true })
  patientEmail: string;

  @Prop({ required: true, min: 0 })
  claimAmount: number;

  @Prop({ default: 0 })
  approvedAmount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  documentUrl: string;

  @Prop()
  documentOriginalName: string;

  @Prop({ 
    default: 'Pending', 
    enum: ['Pending', 'Approved', 'Rejected'] 
  })
  status: 'Pending' | 'Approved' | 'Rejected';

  @Prop({ default: '' })
  insurerComments: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  reviewedBy: User;

  @Prop({ default: Date.now })
  submissionDate: Date;

  @Prop()
  reviewedAt: Date;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);
