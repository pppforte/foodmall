import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  content: string;
  thumbnailUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: { type: String, required: true },
    content: { type: String, default: '' },
    thumbnailUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
