import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  region: string;
  address: string;
  jibunAddress: string;
  phone: string;
  latitude: number;
  longitude: number;
  businessHours: string;
  imageUrl: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true },
    region: { type: String, required: true },
    address: { type: String, required: true },
    jibunAddress: { type: String, default: '' },
    phone: { type: String, default: '' },
    latitude: { type: Number, default: 0 },
    longitude: { type: Number, default: 0 },
    businessHours: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

StoreSchema.index({ region: 1 });
StoreSchema.index({ name: 'text', address: 'text' });

export default mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);
