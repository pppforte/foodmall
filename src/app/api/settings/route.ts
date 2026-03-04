import { NextResponse } from 'next/server';
import { getPublicSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const settings = await getPublicSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to load settings' }, { status: 500 });
  }
}
