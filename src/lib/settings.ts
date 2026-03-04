import dbConnect from '@/lib/mongodb';
import SiteSetting, { ISiteSetting } from '@/models/SiteSetting';
import bcryptjs from 'bcryptjs';

let cachedSettings: ISiteSetting | null = null;
let cacheTime = 0;
const CACHE_TTL = 60_000; // 60 seconds

// Get settings (cached, from DB, or create defaults)
export async function getSettings(): Promise<ISiteSetting> {
  if (cachedSettings && Date.now() - cacheTime < CACHE_TTL) {
    return cachedSettings;
  }

  try {
    await dbConnect();
    let settings = await SiteSetting.findOne();

    if (!settings) {
      // Create default settings, seeding from env vars
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = await bcryptjs.hash(defaultPassword, 10);

      settings = await SiteSetting.create({
        siteName: process.env.NEXT_PUBLIC_SITE_NAME || '완뚝순두부',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        phone: process.env.NEXT_PUBLIC_PHONE || '1668-1977',
        adminUsername: process.env.ADMIN_USERNAME || 'admin',
        adminPasswordHash: hash,
        jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
        smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
        smtpPort: Number(process.env.SMTP_PORT) || 587,
        smtpUser: process.env.SMTP_USER || '',
        smtpPass: process.env.SMTP_PASS || '',
        mailTo: process.env.MAIL_TO || '',
        mailFrom: process.env.MAIL_FROM || '',
        kakaoMapKey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || '',
        naverClientId: process.env.NAVER_CLIENT_ID || '',
        naverClientSecret: process.env.NAVER_CLIENT_SECRET || '',
        blogSearchKeyword: process.env.BLOG_SEARCH_KEYWORD || '완뚝순두부',
        cronSecret: process.env.CRON_SECRET || '',
      });
    }

    cachedSettings = settings;
    cacheTime = Date.now();
    return settings;
  } catch (error) {
    console.error('Failed to load settings from DB:', error);
    // Return a fallback object using env vars
    return {
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || '완뚝순두부',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      phone: process.env.NEXT_PUBLIC_PHONE || '1668-1977',
      adminUsername: process.env.ADMIN_USERNAME || 'admin',
      adminPasswordHash: '',
      jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',
      smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtpPort: Number(process.env.SMTP_PORT) || 587,
      smtpUser: process.env.SMTP_USER || '',
      smtpPass: process.env.SMTP_PASS || '',
      mailTo: process.env.MAIL_TO || '',
      mailFrom: process.env.MAIL_FROM || '',
      kakaoMapKey: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY || '',
      naverClientId: process.env.NAVER_CLIENT_ID || '',
      naverClientSecret: process.env.NAVER_CLIENT_SECRET || '',
      blogSearchKeyword: process.env.BLOG_SEARCH_KEYWORD || '완뚝순두부',
      cronSecret: process.env.CRON_SECRET || '',
    } as ISiteSetting;
  }
}

// Get only public settings (safe to expose to client)
export async function getPublicSettings() {
  const s = await getSettings();
  return {
    siteName: s.siteName,
    siteUrl: s.siteUrl,
    phone: s.phone,
    kakaoMapKey: s.kakaoMapKey,
  };
}

// Invalidate cache (call after updating settings)
export function invalidateSettingsCache() {
  cachedSettings = null;
  cacheTime = 0;
}
