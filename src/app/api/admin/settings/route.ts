import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getSettings, invalidateSettingsCache } from '@/lib/settings';
import dbConnect from '@/lib/mongodb';
import SiteSetting from '@/models/SiteSetting';
import bcryptjs from 'bcryptjs';

export async function GET() {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getSettings();
  const hasPassword = Boolean(settings.adminPasswordHash && settings.adminPasswordHash.length > 0);
  const { adminPasswordHash, ...rest } = settings;
  return NextResponse.json({ success: true, data: { ...rest, hasPassword } });
}

export async function PUT(request: Request) {
  const authed = await verifyAuth();
  if (!authed) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  await dbConnect();

  const allowedFields = [
    'siteName',
    'siteUrl',
    'phone',
    'adminUsername',
    'smtpHost',
    'smtpPort',
    'smtpUser',
    'smtpPass',
    'mailTo',
    'mailFrom',
    'kakaoMapKey',
    'naverClientId',
    'naverClientSecret',
    'blogSearchKeyword',
    'cronSecret',
    'jwtSecret',
  ];

  const updateData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      updateData[field] = body[field];
    }
  }

  if (body.newPassword && typeof body.newPassword === 'string' && body.newPassword.length > 0) {
    updateData.adminPasswordHash = await bcryptjs.hash(body.newPassword, 10);
  }

  await SiteSetting.findOneAndUpdate({}, { $set: updateData }, { new: true, upsert: true });
  invalidateSettingsCache();

  return NextResponse.json({ success: true });
}
