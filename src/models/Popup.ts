import mongoose, { Schema, Document } from 'mongoose';

export interface IPopup extends Document {
  title: string;
  type: 'image' | 'youtube';
  imageUrl: string;
  youtubeUrl: string;
  top: number;
  left: number;
  width: number;
  height: number;
  linkUrl: string;
  linkTarget: '_self' | '_blank';
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const PopupSchema = new Schema<IPopup>(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ['image', 'youtube'], required: true },
    imageUrl: { type: String, default: '' },
    youtubeUrl: { type: String, default: '' },
    top: { type: Number, default: 150 },
    left: { type: Number, default: 0 },
    width: { type: Number, default: 600 },
    height: { type: Number, default: 800 },
    linkUrl: { type: String, default: '' },
    linkTarget: { type: String, enum: ['_self', '_blank'], default: '_blank' },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Popup || mongoose.model<IPopup>('Popup', PopupSchema);
