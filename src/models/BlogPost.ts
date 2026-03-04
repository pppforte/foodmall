import mongoose, { Schema, Document } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  description: string;
  link: string;
  bloggerName: string;
  source: 'naver' | 'manual';
  isActive: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    link: { type: String, required: true },
    bloggerName: { type: String, default: '' },
    source: { type: String, enum: ['naver', 'manual'], default: 'manual' },
    isActive: { type: Boolean, default: true },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

BlogPostSchema.index({ publishedAt: -1 });

export default mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
