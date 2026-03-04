import mongoose, { Schema, Document } from 'mongoose';

export interface ISiteSetting extends Document {
  // Site Info
  siteName: string;
  siteUrl: string;
  phone: string;

  // Admin Auth
  adminUsername: string;
  adminPasswordHash: string;
  jwtSecret: string;

  // SMTP Email
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  mailTo: string;
  mailFrom: string;

  // Kakao Map
  kakaoMapKey: string;

  // Naver API
  naverClientId: string;
  naverClientSecret: string;

  // Blog Collection
  blogSearchKeyword: string;
  cronSecret: string;

  updatedAt: Date;
}

const SiteSettingSchema = new Schema<ISiteSetting>(
  {
    siteName: { type: String, default: '완뚝순두부' },
    siteUrl: { type: String, default: 'http://localhost:3000' },
    phone: { type: String, default: '1668-1977' },

    adminUsername: { type: String, default: 'admin' },
    adminPasswordHash: { type: String, default: '' },
    jwtSecret: { type: String, default: 'change-me-in-production' },

    smtpHost: { type: String, default: 'smtp.gmail.com' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
    mailTo: { type: String, default: '' },
    mailFrom: { type: String, default: '' },

    kakaoMapKey: { type: String, default: '' },

    naverClientId: { type: String, default: '' },
    naverClientSecret: { type: String, default: '' },

    blogSearchKeyword: { type: String, default: '완뚝순두부' },
    cronSecret: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSetting || mongoose.model<ISiteSetting>('SiteSetting', SiteSettingSchema);
