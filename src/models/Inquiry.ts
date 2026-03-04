import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  phone: string;
  hasStore: 'yes' | 'no';
  region: string;
  content: string;
  source: 'form' | 'sky';
  status: 'pending' | 'confirmed' | 'completed';
  privacyAgreed: boolean;
  emailSent: boolean;
  ipAddress: string;
  createdAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    hasStore: { type: String, enum: ['yes', 'no'], default: 'no' },
    region: { type: String, default: '' },
    content: { type: String, default: '' },
    source: { type: String, enum: ['form', 'sky'], default: 'form' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed'], default: 'pending' },
    privacyAgreed: { type: Boolean, required: true },
    emailSent: { type: Boolean, default: false },
    ipAddress: { type: String, default: '' },
  },
  { timestamps: true }
);

InquirySchema.index({ status: 1 });
InquirySchema.index({ createdAt: -1 });

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
