import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notice from '@/models/Notice';

export async function GET() {
  try {
    await dbConnect();
    const notices = await Notice.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: -1 })
      .limit(12);
    return NextResponse.json({ success: true, data: notices });
  } catch (error) {
    console.error('Notices GET error:', error);
    return NextResponse.json({ success: false, error: '공지사항을 불러오는데 실패했습니다.' }, { status: 500 });
  }
}
